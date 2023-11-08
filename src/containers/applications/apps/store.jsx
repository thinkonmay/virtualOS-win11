import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar, LazyComponent } from "../../../utils/general";
import { deleteStore } from "../../../actions/app";
import { useTranslation } from "react-i18next";
import { fetchStore } from "../../../actions/preload";
import { installApp } from "../../../actions/app";
import { PatchApp, ReleaseApp } from "../../../actions/app";
import { isAdmin, isGreenList, isMobile } from "../../../utils/checking";
import { virtapi, supabase } from "../../../supabase/createClient";
import Swal from "sweetalert2";
import { valideUserAccess } from "../../../utils/checking.js";
import "./assets/store.scss";

const emap = (v) => {
  v = Math.min(1 / v, 10);
  return v / 11;
};
const listDraftApp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const MicroStore = () => {
  const wnapp = useSelector((state) => state.apps.store);
  const [tab, setTab] = useState("sthome");
  const [page, setPage] = useState(0);
  const [opapp, setOpapp] = useState({});
  const user = useSelector((state) => state.user);

  const totab = (e) => {
    var x = e.target && e.target.dataset.action;
    if (x) {
      setPage(0);
      setTimeout(() => {
        var target = document.getElementById(x);
        if (target) {
          var tsof = target.parentNode.parentNode.scrollTop,
            trof = target.offsetTop;

          if (Math.abs(tsof - trof) > window.innerHeight * 0.1) {
            target.parentNode.parentNode.scrollTop = target.offsetTop;
          }
        }
      }, 200);
    }
  };

  useLayoutEffect(() => {
    const element = document.getElementById("storeScroll");
    element.scrollTo({ top: (element.scrollHeight * 33) / 100 });

    if (isMobile()) setPage(1);
  }, []);

  const frontScroll = (e) => {
    if (page == 0) {
      var tabs = ["sthome", "gamerib"],
        mntab = "sthome",
        mndis = window.innerHeight;

      tabs.forEach((x) => {
        var target = document.getElementById(x);
        if (target) {
          var tsof = target.parentNode.parentNode.scrollTop,
            trof = target.offsetTop;

          if (Math.abs(tsof - trof) < mndis) {
            mntab = x;
            mndis = Math.abs(tsof - trof);
          }
        }
      });

      setTab(mntab);
    }
  };

  const app_click = async (data) => {
    setOpapp(data);
    setPage(2);
  };

  const dispatch = useDispatch();
  const insertApp = () => {
    dispatch({
      type: "ADMIN_INSERT_STORE",
      payload: {},
    });
  };

  return (
    <div
      className="wnstore floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Store"
      />
      <div className="windowScreen flex">
        <LazyComponent show={!wnapp.hide}>
          <div className="storeNav h-full w-20 flex flex-col">
            <Icon
              fafa="faHome"
              onClick={totab}
              click="sthome"
              width={20}
              payload={page == 0 && tab == "sthome"}
            />
            <Icon
              fafa="faThLarge"
              onClick={() => {
                setPage(1);
              }}
              click="page1"
              width={20}
              payload={page == 1}
            />
            <a
              href="https://github.com/thinkonmay/thinkmay/releases/download/1.0.0/thinkmay_0.3.0_x64_en-US.msi"
              download
            >
              <Icon src="download" ui={true} width={20} />
            </a>
            {/* <Icon onClick={() => {}} width={30} ui={true} src={"nvidia"} /> */}
            {isAdmin() ? (
              <Icon width={30} onClick={insertApp} ui={true} src={"new"} />
            ) : null}
          </div>

          <div
            id="storeScroll"
            className="restWindow msfull win11Scroll"
            onScroll={frontScroll}
          >
            {page == 0 ? <FrontPage app_click={app_click} /> : null}
            {page == 1 ? <DownPage action={app_click} /> : null}
            {page == 2 ? <DetailPage app={opapp} /> : null}
          </div>
        </LazyComponent>
      </div>
    </div>
  );
};

const FrontPage = (props) => {
  const vendors = useSelector((state) => state.globals.vendors);
  const apps = useSelector((state) => state.globals.apps);
  const games = useSelector((state) => state.globals.games);

  const { t, i18n } = useTranslation();

  const [cover, setCover] = useState("");
  useEffect(() => {
    setCover(vendors[0]?.images[0]);
  }, []);

  return (
    <div className="pagecont w-full absolute top-0">
      <Image id="sthome" className="frontPage w-full" src={cover} ext />
      {/* <div className="panelName absolute m-6 text-xl top-0">Home</div> */}
      <div className="w-full overflow-x-scroll noscroll overflow-y-hidden -mt-16">
        <div className="storeRibbon">
          {vendors &&
            vendors.map((vendor, i) => {
              return (
                <a
                  key={i}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => {
                    setCover(vendor.images[0]);
                  }}
                  href={vendor.metadata.href}
                >
                  <Image
                    className="mx-1 dpShad rounded"
                    h={100}
                    absolute={true}
                    src={vendor?.images[0]}
                    err={vendor.icon}
                  />
                </a>
              );
            })}
        </div>
      </div>
      <div
        id="gamerib"
        className="storeScroll frontCont amzGames my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex w-64 flex-col text-gray-100 h-full px-8">
          <div className="text-xl">{t("store.featured-game")}</div>
          <div className="text-xs mt-2">{t("store.featured-game.info")}</div>
        </div>
        <div className="flex w-max pr-8">
          {games.length > 0
            ? games.map((game, i) => {
                return (
                  <div
                    key={i}
                    className="ribcont rounded-md my-0 p-2 pb-2"
                    onClick={() => {
                      props.app_click(game);
                    }}
                    style={{
                      background: game.steam_off
                        ? "linear-gradient(to right, #f7e67b, #c8ae54)"
                        : "",
                    }}
                  >
                    <Image
                      className="mx-1 py-1 mb-6 rounded"
                      w={100}
                      h={100}
                      absolute={true}
                      src={game.icon}
                    />
                    <div className="capitalize text-xs text-center font-semibold">
                      {game.name}
                    </div>
                    <div className="text-xs text-center font-regular">
                      {game.steam_off ? "Steam Offline" : ""}
                    </div>
                  </div>
                );
              })
            : listDraftApp.map((i) => (
                <div
                  key={i}
                  className="ribcont animate-pulse rounded-md my-0 p-2 pb-2"
                >
                  <Image
                    className="mx-1 rounded bg-slate-200"
                    w={100}
                    h={100}
                    ext
                  />
                  <div className="capitalize text-xs text-center font-semibold"></div>
                </div>
              ))}
        </div>
      </div>

      <div
        id="apprib"
        className="storeScroll frontCont amzApps my-8 py-20 w-auto mx-8 \
        flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
      >
        <div className="flex w-64 flex-col text-gray-100 h-full px-8  ">
          <div className="text-xl">{t("store.featured-app")}</div>
          <div className="text-xs mt-2">{t("store.featured-app.info")}</div>
        </div>
        <div className="flex w-max pr-8">
          {apps &&
            apps.map((app, i) => {
              var stars = 5;

              return (
                <div
                  key={i}
                  className="my-0 ribcont rounded-md  p-3 wrapperLogo"
                  onClick={() => {
                    props.app_click(app);
                  }}
                >
                  <Image
                    className="mx-4 mb-6 rounded"
                    w={120}
                    h={100}
                    absolute={true}
                    src={app.icon}
                  />
                  <div className="capitalize text-xs text-center font-semibold">
                    {app.name}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
const stars = 5;
const reviews = 5000;

const DetailPage = ({ app }) => {
  const [dstate, setDown] = useState(0);
  const { t, i18n } = useTranslation();
  const [Options, SetOptions] = useState([]);
  const user = useSelector((state) => state.user);

  const region = ["Hà Nội", "India"];

  useEffect(() => {
    (async () => {
      const { data, error } = await virtapi(`rpc/get_app_from_store`, "POST", {
        store_id: `${app.id}`,
      });
      if (error) throw error;

      const subscription = await supabase
        .from("subscriptions")
        .select("account_id, metadata")
        .eq("account_id", user.id);
      let user_region;
      switch (JSON.stringify(subscription.data.at(0).metadata)) {
        case "{}": // thinkmay internal user
          user_region = region[0];
          break;
        case '{"referal":{"email":"kmrjay730@gmail.com","account_id":"30739186-d473-4349-9a35-8e15980c155a"}}':
          user_region = region[1];
          break;
      }
      for (let index = 0; index < data.length; index++) {
        const option = data[index];
        for (let index = 0; index < option.available.length; index++) {
          if (option.available[index].available.gpus.includes(option.gpu)) {
            if (await valideUserAccess(["admin", "fullstack"])) {
              SetOptions((old) => [...old, option]);
            } else if (user_region == option.region) {
              SetOptions((old) => [...old, option]);
            }
            break;
          }
        }
      }
    })();
  }, []);
  useLayoutEffect(() => {
    const element = document.getElementById("storeScroll");
    element.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const dispatch = useDispatch();

  const download = async ({ id }) => {
    console.log(`download ${id}`);
    if (!isGreenList()) return;
    //const vol_option = await VolumeOption();
    await installApp({
      app_template_id: id,
      availability: "HA",
      speed: "HOT",
      safe: false,
    });
  };

  async function VolumeOption() {
    // POC
    await Swal.fire({
      title: "Select option volume",
      html: `
    <select id="vol_speed" name="Volume Speed" >
        <option value="HOT">HOT</option>
        <option value="WARM">WARM</option>
        <option value="COLD">COLD</option>
    </select>
      <select id="vol_availability" name="Volume Availibity" >
      <option value="LA">Low Availability</option>
      <option value="MA">Medium Availability</option>
      <option value="HA" selected="selected">High Availability</option>
    </select>
    <input type="checkbox" id="cloud_save">
    <label for="cloud_save"> Cloud save?</label>
    `,
      inputPlaceholder: "Select a type volume",
      allowOutsideClick: false,
      showCancelButton: true,
    });

    const speed = document.getElementById("vol_speed").value;
    const availability = document.getElementById("vol_availability").value;
    const safe = document.getElementById("cloud_save").checked;

    return { availability, speed, safe };
  }

  const handleEdit = () => {
    dispatch({
      type: "ADMIN_UPDATE_STORE",
      payload: app,
    });
  };

  const DeleteButton = () => {
    return (
      <div
        onClick={async () => {
          await deleteStore(app);
          await fetchStore();
        }}
      >
        <div className="instbtn mt-1 mb-8 handcr">Delete</div>
      </div>
    );
  };

  const ReleaseAppButton = () => {
    return (
      <div
        onClick={() => {
          ReleaseApp(app);
        }}
      >
        <div className="instbtn mt-1 mb-8 handcr">Release</div>
      </div>
    );
  };

  const EditButton = () => {
    return (
      <div onClick={handleEdit}>
        <div className="instbtn mt-1 mb-8 handcr">Edit</div>
      </div>
    );
  };

  const GotoButton = () => {
    return (
      <div>
        {app.type == "vendor" ? (
          <div className="instbtn mt-12 mb-8 handcr">
            <a
              href={app.metadata.href}
              target={"_blank"}
              style={{ color: "white" }}
            >
              {" "}
              Checkout
            </a>
          </div>
        ) : dstate == 0 ? (
          Options.length > 0 ? (
            Options.map((x) => (
              <div key={x.id}>
                <div
                  className="instbtn mt-12 handcr"
                  payload={x}
                  onClick={() => download(x)}
                >
                  {isGreenList()
                    ? `${x.gpu} ${x.region}`
                    : "Đang đóng demo ^^, Vui lòng liên hệ fanpage"}
                </div>
                {isAdmin() ? (
                  <div onClick={() => PatchApp(x)}>
                    <div className="instbtn mb-8 handcr">Patch</div>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="instbtn mt-12 handcr">
              {t("store.app_not_available")}
            </div>
          )
        ) : (
          <div className="downbar mt-12 mb-8"></div>
        )}
      </div>
    );
  };

  return (
    <div className="detailpage w-full absolute top-0 flex">
      <div className="detailcont">
        <Image
          className="rounded"
          ext
          h={100}
          src={app?.icon}
          err="img/asset/bootlogo.png"
        />
        <div className="flex flex-col items-center text-center relative">
          <div className="text-2xl font-semibold mt-6">{app?.name}</div>
          <div className="text-xs text-blue-500">{app?.type}</div>
          <GotoButton />

          {isAdmin() && app.type != "vendor" ? (
            <>
              <ReleaseAppButton />
              <EditButton />
              <DeleteButton />
            </>
          ) : null}

          <div className="flex mt-4">
            <div>
              <div className="flex items-center text-sm font-semibold">
                {stars}
                <Icon
                  className="text-orange-600 ml-1"
                  fafa="faStar"
                  width={14}
                />
              </div>
              <span className="text-xss">Average</span>
            </div>
            <div className="w-px bg-gray-300 mx-4"></div>
            <div>
              <div className="text-sm font-semibold">
                {Math.round(reviews / 100) / 10}K
              </div>
              <div className="text-xss mt-px pt-1">Ratings</div>
            </div>
          </div>

          <div className="descnt text-xs relative w-0">{app?.description}</div>
        </div>
      </div>
      <div className="growcont flex flex-col">
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">Screenshots</div>
          <div className="overflow-x-scroll win11Scroll mt-4">
            <div className="w-max flex">
              {app?.screenshoots?.map((img) => {
                return (
                  <div className="mr-6 relative" key={Math.random()}>
                    <Image
                      key={Math.random()}
                      className="mr-2 rounded"
                      h={250}
                      src={img}
                      ext
                      err="img/asset/bootlogo.png"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">{t("store.description")}</div>
          <div className="text-xs mt-4">
            <pre>{app?.description}</pre>
          </div>
        </div>
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">{t("store.ratings")}</div>
          <div className="flex mt-4 items-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl reviewtxt font-bold">{stars}</div>
              <div className="text-xss">
                {Math.round(reviews / 100) / 10}K RATINGS
              </div>
            </div>
            <div className="text-xss ml-6">
              {"54321".split("").map((x, i) => {
                return (
                  <div key={i} className="flex items-center">
                    <div className="h-4">{x}</div>
                    <Icon
                      className="text-orange-500 ml-1"
                      fafa="faStar"
                      width={8}
                    />
                    <div className="w-48 ml-2 bg-orange-200 rounded-full">
                      <div
                        style={{
                          width: emap(Math.abs(stars - x)) * 100 + "%",
                          padding: "3px 0",
                        }}
                        className="rounded-full bg-orange-500"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="briefcont py-2 pb-3">
          <div className="text-xs font-semibold">{t("store.features")}</div>
          <div className="text-xs mt-4">
            <pre>{app?.feature}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const DownPage = ({ action }) => {
  const [catg, setCatg] = useState("all");
  const apps = useSelector((state) => state.globals.apps);
  const games = useSelector((state) => state.globals.games);
  const [searchtxt, setShText] = useState("");

  const [storeApps, setStoreApps] = useState([...apps, ...games]);
  const handleSearchChange = (e) => {
    setShText(e.target.value);
  };
  useLayoutEffect(() => {
    setStoreApps([...apps, ...games]);
    const element = document.getElementById("storeScroll");
    element.scrollTo({ top: 0, behavior: "smooth" });
  }, [apps, games]);

  useEffect(() => {
    if (catg == "app") {
      setStoreApps(apps);
      return;
    } else if (catg == "all") {
      setStoreApps([...apps, ...games]);
      return;
    }
    setStoreApps(games);
  }, [catg]);
  const renderSearchResult = () => {
    const keyword = searchtxt.toLowerCase();
    const cloneApp = [...storeApps];

    return cloneApp.map((app, index) => {
      const appName = app.name.toLowerCase();
      if (appName.indexOf(keyword) > -1) {
        return (
          <div
            key={index}
            className="ribcont p-4 pt-8 ltShad prtclk"
            onClick={() => {
              action(app);
            }}
            data-action="page2"
            style={{
              background: app.steam_off
                ? "linear-gradient(to right, #f7e67b, #c8ae54)"
                : "",
            }}
          >
            <Image
              className="mx-4 mb-6 rounded"
              w={100}
              h={100}
              src={app.icon}
              ext
            />
            <div className="capitalize text-xs text-center font-semibold">
              {app.name}
            </div>
            <div className="text-xs text-center font-regular">
              {app.steam_off ? "Steam Offline" : ""}
            </div>
          </div>
        );
      }
    });
  };
  return (
    <div
      id="storeScroll"
      className="pagecont w-full absolute top-0 box-border p-3 sm:p-12"
    >
      <div className="flex flex-wrap gap-5 justify-between">
        <div className="flex items-center ">
          <div
            className="catbtn handcr"
            value={catg == "all"}
            onClick={() => setCatg("all")}
          >
            All
          </div>
          <div
            className="catbtn handcr"
            value={catg == "app"}
            onClick={() => setCatg("app")}
          >
            Apps
          </div>
          <div
            className="catbtn handcr"
            value={catg == "game"}
            onClick={() => setCatg("game")}
          >
            Games
          </div>
        </div>
        <div className="relative srchbar right-0 text-sm ">
          <Icon className="searchIcon" src="search" width={12} />
          <input
            type="text"
            onChange={handleSearchChange}
            value={searchtxt}
            placeholder="Search"
          />
        </div>
      </div>
      <div className="appscont mt-8">
        {storeApps.length > 0
          ? renderSearchResult()
          : listDraftApp.map((i) => (
              <div
                key={i}
                className="animate-pulse ribcont p-4 pt-8 ltShad prtclk"
                data-action="page2"
              >
                <Image
                  className="mx-4 mb-6 rounded bg-slate-200"
                  w={100}
                  h={100}
                  ext
                />
                <div className="capitalize text-xs text-center font-semibold"></div>
              </div>
            ))}
      </div>
    </div>
  );
};
