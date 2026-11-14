export const iconShapes = {
  search: [
    {
      tag: "circle",
      attributes: {
        cx: "11",
        cy: "11",
        r: "6.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m20 20-4.2-4.2"
      }
    }
  ],
  key: [
    {
      tag: "circle",
      attributes: {
        cx: "8",
        cy: "15",
        r: "4"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m11 12 8.5-8.5M16.5 6.5 19 9M14 9l2 2"
      }
    }
  ],
  plus: [
    {
      tag: "path",
      attributes: {
        d: "M12 5v14M5 12h14"
      }
    }
  ],
  minus: [
    {
      tag: "path",
      attributes: {
        d: "M6 12h12"
      }
    }
  ],
  check: [
    {
      tag: "path",
      attributes: {
        d: "m5 12.5 4.5 4.5L19 7.5"
      }
    }
  ],
  x: [
    {
      tag: "path",
      attributes: {
        d: "M6.5 6.5l11 11M17.5 6.5l-11 11"
      }
    }
  ],
  "chev-down": [
    {
      tag: "path",
      attributes: {
        d: "m6.5 9.5 5.5 5.5 5.5-5.5"
      }
    }
  ],
  "chev-right": [
    {
      tag: "path",
      attributes: {
        d: "m9.5 6.5 5.5 5.5-5.5 5.5"
      }
    }
  ],
  "chev-left": [
    {
      tag: "path",
      attributes: {
        d: "m14.5 6.5-5.5 5.5 5.5 5.5"
      }
    }
  ],
  "chev-ud": [
    {
      tag: "path",
      attributes: {
        d: "m8 9.5 4-4 4 4M8 14.5l4 4 4-4"
      }
    }
  ],
  more: [
    {
      tag: "path",
      attributes: {
        d: "M5.5 12h.01M12 12h.01M18.5 12h.01",
        style: {
          strokeWidth: 2.6
        }
      }
    }
  ],
  grip: [
    {
      tag: "path",
      attributes: {
        d: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
        style: {
          strokeWidth: 2.6
        }
      }
    }
  ],
  copy: [
    {
      tag: "rect",
      attributes: {
        x: "8.5",
        y: "8.5",
        width: "11",
        height: "11",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"
      }
    }
  ],
  eye: [
    {
      tag: "path",
      attributes: {
        d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "2.8"
      }
    }
  ],
  "eye-off": [
    {
      tag: "path",
      attributes: {
        d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "2.8"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M4 4l16 16"
      }
    }
  ],
  history: [
    {
      tag: "path",
      attributes: {
        d: "M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5V8H8"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 8.5V12l2.8 1.8"
      }
    }
  ],
  trash: [
    {
      tag: "path",
      attributes: {
        d: "M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5"
      }
    }
  ],
  lock: [
    {
      tag: "rect",
      attributes: {
        x: "5",
        y: "10.5",
        width: "14",
        height: "10",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
      }
    }
  ],
  info: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "8.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 11v5.5M12 7.8v.01"
      }
    }
  ],
  alert: [
    {
      tag: "path",
      attributes: {
        d: "M12 4 2.8 19.5h18.4z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 10v4.5M12 17.2v.01"
      }
    }
  ],
  "alert-c": [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "8.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 7.5v5.5M12 16.2v.01"
      }
    }
  ],
  "check-c": [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "8.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m8.5 12.3 2.4 2.4 4.8-5"
      }
    }
  ],
  agent: [
    {
      tag: "rect",
      attributes: {
        x: "5",
        y: "8",
        width: "14",
        height: "11",
        rx: "3"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 4v4M9.5 13v1.5M14.5 13v1.5"
      }
    }
  ],
  machine: [
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "4.5",
        width: "16",
        height: "6",
        rx: "1.5"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "13.5",
        width: "16",
        height: "6",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M7.5 7.5h.01M7.5 16.5h.01"
      }
    }
  ],
  cert: [
    {
      tag: "path",
      attributes: {
        d: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m9 12 2 2 4-4"
      }
    }
  ],
  terminal: [
    {
      tag: "rect",
      attributes: {
        x: "3",
        y: "4.5",
        width: "18",
        height: "15",
        rx: "2"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m7 9.5 3 2.5-3 2.5M13 15h4"
      }
    }
  ],
  user: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "8.5",
        r: "3.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5"
      }
    }
  ],
  external: [
    {
      tag: "path",
      attributes: {
        d: "M14 4.5h5.5V10M19.5 4.5 11 13M17 13.5v5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"
      }
    }
  ],
  sync: [
    {
      tag: "path",
      attributes: {
        d: "M19.5 9A8 8 0 0 0 5 7.5M4.5 15A8 8 0 0 0 19 16.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M19.5 4v5h-5M4.5 20v-5h5"
      }
    }
  ],
  upload: [
    {
      tag: "path",
      attributes: {
        d: "M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 15v4.5h14V15"
      }
    }
  ],
  clock: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "8.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 7.5V12l3 2"
      }
    }
  ],
  folder: [
    {
      tag: "path",
      attributes: {
        d: "M3.5 7A1.5 1.5 0 0 1 5 5.5h4.2l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z"
      }
    }
  ],
  link: [
    {
      tag: "path",
      attributes: {
        d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
      }
    }
  ],
  settings: [
    {
      tag: "path",
      attributes: {
        d: "M4 7h9M17 7h3M4 17h3M11 17h9"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "15",
        cy: "7",
        r: "2"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "9",
        cy: "17",
        r: "2"
      }
    }
  ],
  bell: [
    {
      tag: "path",
      attributes: {
        d: "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M10 20.5a2 2 0 0 0 4 0"
      }
    }
  ],
  globe: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "8.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5S9.7 5.9 12 3.5z"
      }
    }
  ],
  inbox: [
    {
      tag: "path",
      attributes: {
        d: "M4 13.5 6.5 5h11l2.5 8.5V19H4z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M4 13.5h4.5l1 2h5l1-2H20"
      }
    }
  ],
  home: [
    {
      tag: "path",
      attributes: {
        d: "M4 10.5 12 4l8 6.5V20h-5v-5.5H9V20H4z"
      }
    }
  ],
  "arrow-down": [
    {
      tag: "path",
      attributes: {
        d: "M12 5v14M6.5 13.5 12 19l5.5-5.5"
      }
    }
  ],
  git: [
    {
      tag: "circle",
      attributes: {
        cx: "6.5",
        cy: "6",
        r: "2"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "6.5",
        cy: "18",
        r: "2"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "17.5",
        cy: "8",
        r: "2"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M6.5 8v8M17.5 10c0 4-4 4-9 6.5"
      }
    }
  ],
  calendar: [
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "5.5",
        width: "16",
        height: "14",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M4 10h16M8.5 3.5v4M15.5 3.5v4"
      }
    }
  ],
  "arrow-up": [
    {
      tag: "path",
      attributes: {
        d: "M12 19V5M6.5 10.5 12 5l5.5 5.5"
      }
    }
  ],
  file: [
    {
      tag: "path",
      attributes: {
        d: "M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M13.5 3.5v5h5"
      }
    }
  ],
  "folder-open": [
    {
      tag: "path",
      attributes: {
        d: "M3.5 17.5V7A1.5 1.5 0 0 1 5 5.5h4.2l2 2.5H17.5A1.5 1.5 0 0 1 19 9.5v1"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M3.6 18.4 6 12.1a1.5 1.5 0 0 1 1.4-1h13a.8.8 0 0 1 .75 1.1l-2.3 6.3a1.5 1.5 0 0 1-1.4 1H5a1.5 1.5 0 0 1-1.4-1.1z"
      }
    }
  ],
  download: [
    {
      tag: "path",
      attributes: {
        d: "M12 4.5v11M7.5 11l4.5 4.5 4.5-4.5M5 15v4.5h14V15"
      }
    }
  ],
  menu: [
    {
      tag: "path",
      attributes: {
        d: "M4 7h16M4 12h16M4 17h16"
      }
    }
  ],
  sidebar: [
    {
      tag: "rect",
      attributes: {
        x: "3.5",
        y: "4.5",
        width: "17",
        height: "15",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M9.5 4.5v15"
      }
    }
  ],
  "user-plus": [
    {
      tag: "circle",
      attributes: {
        cx: "10",
        cy: "8.5",
        r: "3.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M3 19.5c1.2-3.3 3.8-5 7-5 1.6 0 3 .4 4.2 1.2M18.5 13v6M15.5 16h6"
      }
    }
  ],
  megaphone: [
    {
      tag: "path",
      attributes: {
        d: "M3.5 10v4a1 1 0 0 0 1 1H7l8.5 5V4L7 9H4.5a1 1 0 0 0-1 1z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M19 8.5a4.5 4.5 0 0 1 0 7M7.5 15.5l1.5 4.5"
      }
    }
  ],
  apps: [
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "4",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "13.5",
        y: "4",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "13.5",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "13.5",
        y: "13.5",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    }
  ],
  building: [
    {
      tag: "path",
      attributes: {
        d: "M3.5 20.5h17M5.5 20.5v-15a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M14.5 9.5h3a1 1 0 0 1 1 1v10M8.5 8h3M8.5 11.5h3M8.5 15h3"
      }
    }
  ],
  sun: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "3.8"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M6 18l1.3-1.3M16.7 7.3 18 6"
      }
    }
  ],
  moon: [
    {
      tag: "path",
      attributes: {
        d: "M19.5 14.2A7.5 7.5 0 0 1 9.8 4.5a7.5 7.5 0 1 0 9.7 9.7z"
      }
    }
  ],
  monitor: [
    {
      tag: "rect",
      attributes: {
        x: "3.5",
        y: "4.5",
        width: "17",
        height: "11.5",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M9 20h6M12 16v4"
      }
    }
  ],
  flask: [
    {
      tag: "path",
      attributes: {
        d: "M9 3.5h6M10 3.5v6l-5.2 8.6a1.6 1.6 0 0 0 1.4 2.4h11.6a1.6 1.6 0 0 0 1.4-2.4L14 9.5v-6M7.2 14.5h9.6"
      }
    }
  ],
  package: [
    {
      tag: "path",
      attributes: {
        d: "M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m4.5 7.5 7.5 4 7.5-4M12 11.5v9M8.2 5.5l7.5 4"
      }
    }
  ],
  sparkles: [
    {
      tag: "path",
      attributes: {
        d: "M10 6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M18 3.5v4M16 5.5h4M18 16.5v3M16.5 18h3"
      }
    }
  ],
  shield: [
    {
      tag: "path",
      attributes: {
        d: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"
      }
    }
  ],
  infinity: [
    {
      tag: "path",
      attributes: {
        d: "M12 12c-1.8-2.4-3.3-3.5-5-3.5a3.5 3.5 0 0 0 0 7c1.7 0 3.2-1.1 5-3.5zm0 0c1.8 2.4 3.3 3.5 5 3.5a3.5 3.5 0 0 0 0-7c-1.7 0-3.2 1.1-5 3.5z"
      }
    }
  ],
  pencil: [
    {
      tag: "path",
      attributes: {
        d: "M4.5 19.5l1-4L15.8 5.2a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L8.5 18.5z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m13.5 7.5 3 3"
      }
    }
  ],
  cloud: [
    {
      tag: "path",
      attributes: {
        d: "M17 18.5H9a6 6 0 1 1 5.7-8H17a4 4 0 0 1 0 8z"
      }
    }
  ],
  flag: [
    {
      tag: "path",
      attributes: {
        d: "M5.5 20.5v-16"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M5.5 4.5c4.5-2 8.5 2 13 0V14c-4.5 2-8.5-2-13 0"
      }
    }
  ],
  undo: [
    {
      tag: "path",
      attributes: {
        d: "M9 13.5 4.5 9 9 4.5M4.5 9h10a5 5 0 0 1 0 10H11"
      }
    }
  ],
  pause: [
    {
      tag: "rect",
      attributes: {
        x: "6",
        y: "5",
        width: "4",
        height: "14",
        rx: "1"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "14",
        y: "5",
        width: "4",
        height: "14",
        rx: "1"
      }
    }
  ],
  hourglass: [
    {
      tag: "path",
      attributes: {
        d: "M6 3.5h12M6 20.5h12"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M7.5 3.5V6c0 2.5 4.5 4 4.5 6s-4.5 3.5-4.5 6v2.5M16.5 3.5V6c0 2.5-4.5 4-4.5 6s4.5 3.5 4.5 6v2.5"
      }
    }
  ],
  alarm: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "13",
        r: "7"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 9.5V13l2.5 1.5M4.5 6 7 3.5M19.5 6 17 3.5M7 19l-1.5 1.5M17 19l1.5 1.5"
      }
    }
  ],
  activity: [
    {
      tag: "path",
      attributes: {
        d: "M3.5 12H7l2.5-7 5 14 2.5-7h3.5"
      }
    }
  ],
  rocket: [
    {
      tag: "path",
      attributes: {
        d: "M8.5 15.5C8 9.5 13 4.5 19.5 4.5c0 6.5-5 11.5-11 11z"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "15",
        cy: "9",
        r: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M9 11.5H5.5L8 8h3.5M12.5 15v3.5L16 16v-3.5M6.5 17.5l-2 2"
      }
    }
  ],
  archive: [
    {
      tag: "rect",
      attributes: {
        x: "3.5",
        y: "4.5",
        width: "17",
        height: "4",
        rx: "1"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M5 8.5v10A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-10M10 12.5h4"
      }
    }
  ],
  "archive-restore": [
    {
      tag: "rect",
      attributes: {
        x: "3.5",
        y: "4.5",
        width: "17",
        height: "4",
        rx: "1"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M5 8.5v10A1.5 1.5 0 0 0 6.5 20H8M19 8.5v10a1.5 1.5 0 0 1-1.5 1.5H16M9.5 14.5 12 12l2.5 2.5M12 12v8"
      }
    }
  ],
  "arrow-right-left": [
    {
      tag: "path",
      attributes: {
        d: "M16 4l3.5 3.5L16 11M19.5 7.5h-15M8 13l-3.5 3.5L8 20M4.5 16.5h15"
      }
    }
  ],
  receipt: [
    {
      tag: "path",
      attributes: {
        d: "M5.5 3.5h13v17l-2.2-1.2-2.1 1.2-2.2-1.2-2.2 1.2-2.1-1.2-2.2 1.2z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M9 8h6M9 11.5h6M9 15h3.5"
      }
    }
  ],
  "credit-card": [
    {
      tag: "rect",
      attributes: {
        x: "3",
        y: "5.5",
        width: "18",
        height: "13",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M3 10h18M7 15h3"
      }
    }
  ],
  "calendar-clock": [
    {
      tag: "path",
      attributes: {
        d: "M20 10V7a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 4 7v11a1.5 1.5 0 0 0 1.5 1.5H10M4 10h6.5M8.5 3.5v4M15.5 3.5v4"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "16",
        cy: "16",
        r: "4.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M16 14v2l1.5 1"
      }
    }
  ],
  "chart-column": [
    {
      tag: "path",
      attributes: {
        d: "M4 4v14.5A1.5 1.5 0 0 0 5.5 20H20M9 16.5v-3M13.5 16.5v-9M18 16.5V11"
      }
    }
  ],
  gift: [
    {
      tag: "rect",
      attributes: {
        x: "3.5",
        y: "8",
        width: "17",
        height: "4",
        rx: "1"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 8v12.5M5.5 12v7A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5v-7"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M12 8c-1-2.5-2.5-4-4-4a2 2 0 0 0 0 4M12 8c1-2.5 2.5-4 4-4a2 2 0 0 1 0 4"
      }
    }
  ],
  "file-text": [
    {
      tag: "path",
      attributes: {
        d: "M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M13.5 3.5v5h5M9 9h2M9 12.5h6M9 16h6"
      }
    }
  ],
  award: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "9",
        r: "5.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M8.6 13.3 7 20.5l5-2.5 5 2.5-1.6-7.2"
      }
    }
  ],
  "scan-line": [
    {
      tag: "path",
      attributes: {
        d: "M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M7.5 12h9"
      }
    }
  ],
  "scan-search": [
    {
      tag: "path",
      attributes: {
        d: "M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "11.5",
        cy: "11.5",
        r: "3"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m16.5 16.5-2.9-2.9"
      }
    }
  ],
  radar: [
    {
      tag: "circle",
      attributes: {
        cx: "12",
        cy: "12",
        r: "8.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M16.5 12A4.5 4.5 0 1 1 12 7.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m12 12 5.5-5.5M12 12h.01"
      }
    }
  ],
  zap: [
    {
      tag: "path",
      attributes: {
        d: "M13 3.5 5 13.5h6.5l-1 7 8-10H12z"
      }
    }
  ],
  vault: [
    {
      tag: "rect",
      attributes: {
        x: "3.5",
        y: "4.5",
        width: "17",
        height: "14",
        rx: "1.5"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "11",
        cy: "11.5",
        r: "3.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M11 11.5h.01M17.5 9.5v4M7 18.5v2M17 18.5v2"
      }
    }
  ],
  "file-key": [
    {
      tag: "path",
      attributes: {
        d: "M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5z"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M13.5 3.5v5h5"
      }
    },
    {
      tag: "circle",
      attributes: {
        cx: "10",
        cy: "15.5",
        r: "2"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "m11.4 14.1 3.6-3.6M13.8 11.7l1.2 1.2"
      }
    }
  ],
  users: [
    {
      tag: "circle",
      attributes: {
        cx: "9.5",
        cy: "8.5",
        r: "3.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M3 19.5c1.2-3.3 3.6-5 6.5-5s5.3 1.7 6.5 5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M15.5 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.8c1.7.7 2.9 2.3 3.5 4.7"
      }
    }
  ],
  "layout-grid": [
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "4",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "13.5",
        y: "4",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "13.5",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "13.5",
        y: "13.5",
        width: "6.5",
        height: "6.5",
        rx: "1.2"
      }
    }
  ],
  server: [
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "4.5",
        width: "16",
        height: "6",
        rx: "1.5"
      }
    },
    {
      tag: "rect",
      attributes: {
        x: "4",
        y: "13.5",
        width: "16",
        height: "6",
        rx: "1.5"
      }
    },
    {
      tag: "path",
      attributes: {
        d: "M7.5 7.5h.01M7.5 16.5h.01"
      }
    }
  ]
} as const;
