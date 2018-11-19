var APP_DATA = {
  "scenes": [
    {
      "id": "0-a1",
      "name": "A1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 752,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -3.125756644780079,
          "pitch": 0.4409124989422981,
          "rotation": 0,
          "target": "2-next-floor"
        },
        {
          "yaw": -2.192109958768439,
          "pitch": 0.2631280131756917,
          "rotation": 5.497787143782138,
          "target": "1-t1"
        },
        {
          "yaw": 2.091039621752829,
          "pitch": 0.3658879904720358,
          "rotation": 0.7853981633974483,
          "target": "1-t1"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -1.644553612326499,
          "pitch": 0.009645808228491148,
          "title": "Archives Collection",
          "text": "&lt;edit text&gt;"
        },
        {
          "yaw": 2.04417773064449,
          "pitch": -0.09042590610408396,
          "title": "Restrooms",
          "text": ""
        }
      ]
    },
    {
      "id": "1-t1",
      "name": "T1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 752,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -3.1224721711061196,
          "pitch": 0.3147862148902991,
          "rotation": 0,
          "target": "2-next-floor"
        },
        {
          "yaw": 2.2933010039250252,
          "pitch": 0.346506363532491,
          "rotation": 0.7853981633974483,
          "target": "0-a1"
        },
        {
          "yaw": -2.3171193282744973,
          "pitch": 0.22035419022478386,
          "rotation": 5.497787143782138,
          "target": "0-a1"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-next-floor",
      "name": "next-floor",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 752,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [],
      "infoHotspots": []
    }
  ],
  "name": "11",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
