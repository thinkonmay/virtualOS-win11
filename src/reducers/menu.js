const defState = {
  hide: true,
  top: 80,
  left: 360,
  opts: "desk",
  attr: null,
  dataset: null,
  data: {
    desk: {
      width: "310px",
      secwid: "200px",
    },
    task: {
      width: "220px",
      secwid: "120px",
      ispace: false, // show the space for icons in menu
    },
    app: {
      width: "310px",
      secwid: "200px",
    },
    proxy: {
      width: "150px",
      secwid: "100px",
    },
    subscriptions: {
      width: "180px",
      secwid: "100px",
    },
    subscription: {
      width: "180px",
      secwid: "100px",
    },
    externalApp: {
      width: "190px",
      secwid: "200px",
    },
    worker: {
      width: "150px",
      secwid: "100px",
    },
    worker_session: {
      width: "150px",
      secwid: "100px",
    },
    user_session: {
      width: "150px",
      secwid: "100px",
    },
    volumes: {
      width: "150px",
      secwid: "100px",
    },
    volume: {
      width: "150px",
      secwid: "100px",
    },
    apps: {
      width: "150px",
      secwid: "100px",
    },
    app: {
      width: "150px",
      secwid: "100px",
    },
    cluster: {
      width: "150px",
      secwid: "100px",
    },
  },
  menus: {
    desk: [
      {
        name: "View",
        icon: "view",
        type: "svg",
        opts: [
          {
            name: "Large icons",
            action: "changeIconSize",
            payload: "large",
          },
          {
            name: "Medium icons",
            action: "changeIconSize",
            payload: "medium",
          },
          {
            name: "Small icons",
            action: "changeIconSize",
            payload: "small",
            dot: true,
          },
          {
            type: "hr",
          },
          {
            name: "Show desktop icons",
            action: "deskHide",
            check: true,
          },
        ],
      },
      {
        name: "Sort by",
        icon: "sort",
        type: "svg",
        opts: [
          {
            name: "Name",
            action: "changeSort",
            payload: "name",
          },
          {
            name: "Size",
            action: "changeSort",
            payload: "size",
          },
          {
            name: "Date modified",
            action: "changeSort",
            payload: "date",
          },
        ],
      },
      {
        name: "Refresh",
        action: "refresh",
        type: "svg",
        icon: "refresh",
      },
      {
        type: "hr",
      },
      {
        name: "New",
        icon: "New",
        type: "svg",
        opts: [
          {
            name: "Folder",
          },
          {
            name: "Shortcut",
          },
          {
            name: "Text Document",
          },
          {
            name: "Compressed (zipped) Folder",
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "Display settings",
        icon: "display",
        type: "svg",
        action: "SETTINGS",
        payload: "full",
      },
      {
        name: "Personalize",
        icon: "personalize",
        type: "svg",
        action: "SETTINGS",
        payload: "full",
      },
      {
        type: "hr",
      },
      {
        name: "Next desktop background",
        action: "WALLNEXT",
      },
      {
        name: "Open in Terminal",
        icon: "terminal",
        action: "OPENTERM",
        payload: "C:\\Users\\Blue\\Desktop",
      },
      {
        name: "Guideline",
        action: "DESKABOUT",
        icon: "about",
        payload: true,
      },
    ],
    task: [
      {
        name: "Align icons",
        opts: [
          {
            name: "Left",
            action: "changeTaskAlign",
            payload: "left",
          },
          {
            name: "Center",
            action: "changeTaskAlign",
            payload: "center",
            dot: true,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "Search",
        opts: [
          {
            name: "Show",
            action: "TASKSRCH",
            payload: true,
          },
          {
            name: "Hide",
            action: "TASKSRCH",
            payload: false,
          },
        ],
      },
      {
        name: "Widgets",
        opts: [
          {
            name: "Show",
            action: "TASKWIDG",
            payload: true,
          },
          {
            name: "Hide",
            action: "TASKWIDG",
            payload: false,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "Show Desktop",
        action: "SHOWDSK",
      },
    ],
    app: [
      {
        name: "Open",
        action: "performApp",
        payload: "open",
      },
      //{
      //  name: "Run as administrator",
      //  action: "performApp",
      //  payload: "open",
      //  icon: "win/shield",
      //},
      //{
      //  name: "Open file location",
      //  dsb: true,
      //},
      //{
      //  name: "Unpin from start",
      //  dsb: true,
      //},
      //{
      //  name: "Compress to Zip file",
      //  dsb: true,
      //},
      //{
      //  name: "Copy as path",
      //  dsb: true,
      //},
      {
        name: "Properties",
        dsb: true,
      },
      {
        type: "hr",
      },
      {
        name: "Delete shortcut",
        action: "performApp",
        payload: "delshort",
      },
      {
        name: "Delete",
        action: "delApp",
        payload: "delete",
      },
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
    ],
    apps: [
      {
        name: "Release App",
        action: "RELEASE_APP",
        payload: "open",
      },
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
    ],
    cluster: [
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
    ],
    externalApp: [
      {
        name: "Open",
        action: "OPEN_APP",
      },
      {
        name: "Open in new tab",
        action: "OPEN_APP_NEWTAB",
        icon: "newTab",
      },
      {
        name: "Reset App",
        action: "RESET_APP",
        icon: "reset",
      },
      {
        name: "Start App",
        action: "START_APP",
        icon: "start",
      },
      {
        name: "Pause App",
        action: "PAUSE_APP",
        icon: "shutdown",
      },
      {
        type: "hr",
      },
      {
        name: "Delete",
        action: "delApp",
        icon: "delete",
        payload: "delete",
      },
    ],
    worker: [
      {
        name: "Open",
        action: "FILEDIRWORKER",
        payload: "open",
      },
      {
        name: "Connect",
        action: "CONNECTWORKER",
        payload: "connect",
      },
      {
        name: "Create Session",
        action: "CREATESESSION",
        payload: "connect",
      },
      {
        name: "Detail Info",
        action: "VIEW_DETAIL",
        payload: "openmodal",
      },
    ],
    proxy: [
      {
        name: "Open",
        action: "FILEDIRWORKER",
        payload: "open",
      },
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "openmodal",
      },
    ],
    subscriptions: [
      {
        name: "New Subscription",
        action: "CREATE_SUB",
        payload: "open",
      },
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "openmodal",
      },
    ],
    subscription: [
      {
        name: "Modify",
        action: "MODIFY_SUB",
        payload: "open",
      },
    ],
    worker_session: [
      {
        name: "Open",
        action: "FILEDIRWORKER",
      },
      {
        name: "Connect",
        action: "CONNECTWORKERSESSION",
        payload: "connect",
      },
      {
        name: "Deactivate Session",
        action: "DEACTIVATESESSION",
        payload: "connect",
      },
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
    ],
    volume: [
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
      {
        name: "Connect",
        action: "CONNECTVOLUMEWORKER",
        payload: "connect",
      },
      {
        name: "Stop",
        action: "STOPVOLUME",
        payload: "stop",
      },
    ],
    volumes: [
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
    ],
    user_session: [
      {
        name: "Detail",
        action: "VIEW_DETAIL",
        payload: "detail",
      },
    ],
  },
};

const menusReducer = (state = defState, action) => {
  var tmpState = {
    ...state,
  };
  if (action.type == "MENUHIDE") {
    tmpState.hide = true;
  } else if (action.type == "MENUSHOW") {
    tmpState.hide = false;
    tmpState.top = (action.payload && action.payload.top) || 272;
    tmpState.left = (action.payload && action.payload.left) || 430;
    tmpState.opts = (action.payload && action.payload.menu) || "desk";
    tmpState.attr = action.payload && action.payload.attr;
    tmpState.dataset = action.payload && action.payload.dataset;
  } else if (action.type == "MENUCHNG") {
    tmpState = {
      ...action.payload,
    };
  }

  return tmpState;
};

export default menusReducer;
