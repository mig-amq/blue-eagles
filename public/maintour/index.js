/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // Grab elements from DOM.
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  var currScene;
  // Detect desktop or mobile mode.
  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  // Detect whether we are on a touch device.
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // Use tooltip fallback mode on IE < 11.
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // Viewer options.
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  // Initialize viewer.
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  
  // Create scenes.
  var scenes = data.scenes.map(function(data) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" });
    var geometry = new Marzipano.CubeGeometry(data.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100*Math.PI/180, 120*Math.PI/180);
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Create link hotspots.
    data.linkHotspots.forEach(function(hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    // Create info hotspots.
    data.infoHotspots.forEach(function(hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: data,
      scene: scene,
      view: view
    };
  });

  if (parent.generateLinks)
    parent.generateLinks(scenes);

  // Set up autorotate, if enabled.
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI/2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  // Set up fullscreen mode, if supported.
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function() {
      screenfull.toggle();
    });
    screenfull.on('change', function() {
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add('enabled');
      } else {
        fullscreenToggleElement.classList.remove('enabled');
      }
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
  }

  // DOM elements for view controls.
  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  // var viewInElement = document.querySelector('#viewIn');
  // var viewOutElement = document.querySelector('#viewOut');

  // Dynamic parameters for controls.
  var velocity = 0.7;
  var friction = 3;

  // Associate view controls with elements.
  var controls = viewer.controls();
  controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,     'y', -velocity, friction), true);
  controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,   'y',  velocity, friction), true);
  controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,   'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement,  'x',  velocity, friction), true);
  // controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,  'zoom', -velocity, friction), true);
  // controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom',  velocity, friction), true);

  // Associate keys   
  controls.registerMethod('upKey',    new Marzipano.KeyControlMethod(38,     'y', -velocity, friction), true);
  controls.registerMethod('downKey',  new Marzipano.KeyControlMethod(40,   'y',  velocity, friction), true);
  controls.registerMethod('leftKey',  new Marzipano.KeyControlMethod(37,   'x', -velocity, friction), true);
  controls.registerMethod('rightKey', new Marzipano.KeyControlMethod(39,  'x',  velocity, friction), true);
  controls.registerMethod('inKey',    new Marzipano.KeyControlMethod(61,  'zoom', -velocity, friction), true);
  controls.registerMethod('outKey',   new Marzipano.KeyControlMethod(173, 'zoom',  velocity, friction), true);

  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  var prevView;

  function switchScene(scene, yaw) {
    prevView = currScene;
    currScene = scene;

    var params = Object.assign({}, scene.data.initialViewParameters);

    if (prevView && !currScene.data.specialYaw) {
      params.yaw = prevView.view._yaw;
    }

    if (yaw != null)
      params.yaw = yaw;

    if (parent.changeFloor)
      parent.changeFloor(scene.data.name, scene.data.floor);

    scene.view.setParameters(params);
    scene.scene.switchTo();
  }

  function minimapClick(sceneId, yaw) {
    switchScene(findSceneById(sceneId), yaw)
  }

  function resetScene() {
    switchScene(currScene);
  }

  function reset(){
    switchScene(findSceneById("1-6-a"));
  }

  function createLinkHotspotElement(hotspot) {

    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');
    // Create image element.
    var icon = document.createElement('img');

    if(hotspot.icon)
      icon.src = hotspot.icon;
    else
      icon.src = 'img/link.png';

    icon.classList.add('link-hotspot-icon');

    // Set rotation transform.
    var transformProperties = [ '-ms-transform', '-webkit-transform', 'transform' ];
    for (var i = 0; i < transformProperties.length; i++) {
      var property = transformProperties[i];
      icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    // Add click event handler.
    wrapper.addEventListener('click', function() {
      let scene = findSceneById(hotspot.target);
      switchScene(scene);
    });

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    stopTouchAndScrollEventPropagation(wrapper);

    // Create tooltip element.
    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip');
    tooltip.classList.add('link-hotspot-tooltip');
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {

    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

    // Create hotspot/tooltip header.
    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    // Create image element.
    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');

    if (hotspot.icon)
      icon.src = hotspot.icon;
    else
      icon.src = 'img/info.png';

    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);

    // Create title element.
    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title;
    titleWrapper.appendChild(title);

    // Create close element.
    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);

    // Construct header element.
    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    // Create text element.
    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;

    // Place header and text into wrapper element.
    wrapper.appendChild(header);

    if (hotspot.text)
      wrapper.appendChild(text);

    // Create a modal for the hotspot content to appear on mobile mode.
    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);

    var toggle = function() {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };

    // Show content when hotspot is clicked.
    if(hotspot.popup){
      wrapper.querySelector('.info-hotspot-header').addEventListener('click', parent.displayModal);
    }else{
      wrapper.querySelector('.info-hotspot-header').addEventListener('click', (hotspot.text) ? toggle : {});
    }

    // Hide content when close icon is clicked.
    // modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  // Prevent touch and scroll events from reaching the parent element.
  function stopTouchAndScrollEventPropagation(element, eventList) {
    var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
                      'wheel', 'mousewheel' ];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Display the initial scene.
  switchScene(scenes[1]);