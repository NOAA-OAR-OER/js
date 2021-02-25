(function() {
  'use strict';
  var videojs = null;
  if (typeof window.videojs === 'undefined' && typeof require === 'function') {
      videojs = require('video.js')
  } else {
      videojs = window.videojs
  }(function(window, videojs) {
      var videoJsResolutionSwitcher, defaults = {
          ui: true
      };
      var MenuItem = videojs.getComponent('MenuItem');
      var ResolutionMenuItem = videojs.extend(MenuItem, {
          constructor: function(player, options) {
              options.selectable = true;
              MenuItem.call(this, player, options);
              this.src = options.src;
              player.on('resolutionchange', videojs.bind(this, this.update))
          }
      });
      ResolutionMenuItem.prototype.handleClick = function(event) {
          MenuItem.prototype.handleClick.call(this, event);
          this.player_.currentResolution(this.options_.label)
      };
      ResolutionMenuItem.prototype.update = function() {
          if (!this.player_) {
              return false
          }
          var selection = this.player_.currentResolution();
          this.selected(this.options_.label === selection.label);
          this.player_.controlBar.resolutionSwitcher.lastElementChild.textContent = selection.label;
          this.player_.controlBar.resolutionSwitcher.children[1].classList.remove('vjs-hidden')
      };
      MenuItem.registerComponent('ResolutionMenuItem', ResolutionMenuItem);
      var MenuButton = videojs.getComponent('MenuButton');
      var ResolutionMenuButton = videojs.extend(MenuButton, {
          constructor: function(player, options) {
              this.label = document.createElement('span');
              options.label = 'Quality';
              MenuButton.call(this, player, options);
              this.el().setAttribute('aria-label', 'Quality');
              this.controlText('Quality');
              this.el().className += ' vjs-resolution-button';
              if (options.dynamicLabel) {
                  videojs.dom.addClass(this.label, 'vjs-resolution-button-label');
                  this.el().appendChild(this.label)
              } else {
                  var staticLabel = document.createElement('span');
                  videojs.addClass(staticLabel, 'vjs-menu-icon');
                  this.el().appendChild(staticLabel)
              }
              player.on('updateSources', videojs.bind(this, this.update))
          }
      });
      ResolutionMenuButton.prototype.createItems = function() {
          var menuItems = [];
          var labels = (this.sources && this.sources.label) || {};
          for (var key in labels) {
              if (labels.hasOwnProperty(key)) {
                  menuItems.push(new ResolutionMenuItem(this.player_, {
                      label: key,
                      src: labels[key],
                      selected: key === (this.currentSelection ? this.currentSelection.label : false)
                  }))
              }
          }
          return menuItems
      };
      ResolutionMenuButton.prototype.update = function() {
          this.sources = this.player_.getGroupedSrc();
          this.currentSelection = this.player_.currentResolution();
          this.label.innerHTML = this.currentSelection ? this.currentSelection.label : '';
          return MenuButton.prototype.update.call(this)
      };
      ResolutionMenuButton.prototype.buildCSSClass = function() {
          return MenuButton.prototype.buildCSSClass.call(this) + ' vjs-resolution-button'
      };
      MenuButton.registerComponent('ResolutionMenuButton', ResolutionMenuButton);
      videoJsResolutionSwitcher = function(options) {
          var settings = videojs.mergeOptions(defaults, options),
              player = this,
              groupedSrc = {},
              currentSources = {},
              currentResolutionState = {};
          player.updateSrc = function(src) {
              if (!src) {
                  return player.src()
              }
              src = src.filter(function(source) {
                  try {
                      return (player.canPlayType(source.type) !== '')
                  } catch (e) {
                      return true
                  }
              });
              this.currentSources = src.sort(compareResolutions);
              this.groupedSrc = bucketSources(this.currentSources);
              var chosen = chooseSrc(this.groupedSrc, this.currentSources);
              this.currentResolutionState = {
                  label: chosen.label,
                  sources: chosen.sources
              };
              player.trigger('updateSources');
              player.setSourcesSanitized(chosen.sources, chosen.label);
              player.trigger('resolutionchange');
              return player
          };
          player.currentResolution = function(label, customSourcePicker) {
              if (label == null) {
                  return this.currentResolutionState
              }
              if (!this.groupedSrc || !this.groupedSrc.label || !this.groupedSrc.label[label]) {
                  return
              }
              var sources = this.groupedSrc.label[label];
              var currentTime = player.currentTime();
              var isPaused = player.paused();
              if (!isPaused && this.player_.options_.bigPlayButton) {
                  this.player_.bigPlayButton.hide()
              }
              var handleSeekEvent = 'loadeddata';
              if (this.player_.techName_ !== 'Youtube' && this.player_.preload() === 'none' && this.player_.techName_ !== 'Flash') {
                  handleSeekEvent = 'timeupdate'
              }
              player.setSourcesSanitized(sources, label, customSourcePicker || settings.customSourcePicker).one(handleSeekEvent, function() {
                  player.currentTime(currentTime);
                  if (!isPaused) {
                      player.play()
                  }
                  player.trigger('resolutionchange')
              });
              return player
          };
          player.getGroupedSrc = function() {
              return this.groupedSrc
          };
          player.setSourcesSanitized = function(sources, label, customSourcePicker) {
              this.currentResolutionState = {
                  label: label,
                  sources: sources
              };
              if (typeof customSourcePicker === 'function') {
                  return customSourcePicker(player, sources, label)
              }
              player.src(sources.map(function(src) {
                  return {
                      src: src.src,
                      type: src.type,
                      res: src.res
                  }
              }));
              return player
          };

          function compareResolutions(a, b) {
              if (!a.res || !b.res) {
                  return 0
              }
              return (+b.res) - (+a.res)
          }

          function bucketSources(src) {
              var resolutions = {
                  label: {},
                  res: {},
                  type: {}
              };
              src.map(function(source) {
                  initResolutionKey(resolutions, 'label', source);
                  initResolutionKey(resolutions, 'res', source);
                  initResolutionKey(resolutions, 'type', source);
                  appendSourceToKey(resolutions, 'label', source);
                  appendSourceToKey(resolutions, 'res', source);
                  appendSourceToKey(resolutions, 'type', source)
              });
              return resolutions
          }

          function initResolutionKey(resolutions, key, source) {
              if (resolutions[key][source[key]] == null) {
                  resolutions[key][source[key]] = []
              }
          }

          function appendSourceToKey(resolutions, key, source) {
              resolutions[key][source[key]].push(source)
          }

          function chooseSrc(groupedSrc, src) {
              var selectedRes = settings['default'];
              var selectedLabel = '';
              if (selectedRes === 'high') {
                  selectedRes = src[0].res;
                  selectedLabel = src[0].label
              } else if (selectedRes === 'low' || selectedRes == null || !groupedSrc.res[selectedRes]) {
                  selectedRes = src[src.length - 1].res;
                  selectedLabel = src[src.length - 1].label
              } else if (groupedSrc.res[selectedRes]) {
                  selectedLabel = groupedSrc.res[selectedRes][0].label
              }
              return {
                  res: selectedRes,
                  label: selectedLabel,
                  sources: groupedSrc.res[selectedRes]
              }
          }

          function initResolutionForYt(player) {
              var _yts = {
                  highres: {
                      res: 1080,
                      label: '1080',
                      yt: 'highres'
                  },
                  hd1080: {
                      res: 1080,
                      label: '1080',
                      yt: 'hd1080'
                  },
                  hd720: {
                      res: 720,
                      label: '720',
                      yt: 'hd720'
                  },
                  large: {
                      res: 480,
                      label: '480',
                      yt: 'large'
                  },
                  medium: {
                      res: 360,
                      label: '360',
                      yt: 'medium'
                  },
                  small: {
                      res: 240,
                      label: '240',
                      yt: 'small'
                  },
                  tiny: {
                      res: 144,
                      label: '144',
                      yt: 'tiny'
                  },
                  auto: {
                      res: 0,
                      label: 'auto',
                      yt: 'auto'
                  }
              };
              var _customSourcePicker = function(_player, _sources, _label) {
                  player.tech_.ytPlayer.setPlaybackQuality(_sources[0]._yt);
                  player.trigger('updateSources');
                  return player
              };
              settings.customSourcePicker = _customSourcePicker;
              player.tech_.ytPlayer.setPlaybackQuality('auto');
              player.tech_.ytPlayer.addEventListener('onPlaybackQualityChange', function(event) {
                  for (var res in _yts) {
                      if (res.yt === event.data) {
                          player.currentResolution(res.label, _customSourcePicker);
                          return
                      }
                  }
              });
              player.one('play', function() {
                  var qualities = player.tech_.ytPlayer.getAvailableQualityLevels();
                  var _sources = [];
                  qualities.map(function(q) {
                      _sources.push({
                          src: player.src().src,
                          type: player.src().type,
                          label: _yts[q].label,
                          res: _yts[q].res,
                          _yt: _yts[q].yt
                      })
                  });
                  player.groupedSrc = bucketSources(_sources);
                  var chosen = {
                      label: 'auto',
                      res: 0,
                      sources: player.groupedSrc.label.auto
                  };
                  this.currentResolutionState = {
                      label: chosen.label,
                      sources: chosen.sources
                  };
                  player.trigger('updateSources');
                  player.setSourcesSanitized(chosen.sources, chosen.label, _customSourcePicker)
              })
          }
          player.ready(function() {
              if (settings.ui) {
                  var menuButton = new ResolutionMenuButton(player, settings);
                  player.controlBar.resolutionSwitcher = player.controlBar.el_.insertBefore(menuButton.el_, player.controlBar.getChild('fullscreenToggle').el_);
                  player.controlBar.resolutionSwitcher.dispose = function() {
                      this.parentNode.removeChild(this)
                  }
              }
              if (player.options_.sources.length > 1) {
                  player.updateSrc(player.options_.sources)
              }
              if (player.techName_ === 'Youtube') {
                  initResolutionForYt(player)
              }
          })
      };
      videojs.registerPlugin('videoJsResolutionSwitcher', videoJsResolutionSwitcher)
  })(window, videojs)
})();