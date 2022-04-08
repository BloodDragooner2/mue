import variables from "modules/variables";
import { PureComponent } from "react";
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdOutlineExtension,
} from "react-icons/md";
import Tab from "./Tab";
import ErrorBoundary from "../../../ErrorBoundary";

export default class Tabs extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.props.children[0].props.label,
      currentName: this.props.children[0].props.name,
    };
  }

  onClick = (tab, name) => {
    if (name !== this.state.currentName) {
      variables.stats.postEvent("tab", `Opened ${name}`);
    }

    this.setState({
      currentTab: tab,
      currentName: name,
    });
  };

  render() {
    const reminderInfo = (
      <div className="reminder-info" style={{ display: "none" }}>
        <span className="title">
          {variables.language.getMessage(
            variables.languagecode,
            "modals.main.settings.reminder.title"
          )}
        </span>
        <span className="subtitle">
          {variables.language.getMessage(
            variables.languagecode,
            "modals.main.settings.reminder.message"
          )}
        </span>
        <button onClick={() => window.location.reload()}>
          {variables.language.getMessage(
            variables.languagecode,
            "modals.main.error_boundary.refresh"
          )}
        </button>
      </div>
    );

    let settingsActive = "";
    let addonsActive = "";
    let marketplaceActive = "";

    switch (this.props.current) {
      case "settings":
        settingsActive = " navbar-item-active";
        break;
      case "addons":
        addonsActive = " navbar-item-active";
        break;
      case "marketplace":
        marketplaceActive = " navbar-item-active";
        break;
      default:
        break;
    }

    return (
      <div style={{ display: "flex", width: "100%" }}>
        <ul className="sidebar">
          {reminderInfo}
          {this.props.children.map((tab, index) => (
            <Tab
              currentTab={this.state.currentTab}
              key={index}
              label={tab.props.label}
              onClick={(nextTab) => this.onClick(nextTab, tab.props.name)}
              navbarTab={this.props.navbar || false}
            />
          ))}
        </ul>
        <div className="tab-content" style={{ width: "100%" }}>
          <ErrorBoundary>
            <div className="modalNavbar">
              <button
                className={"navbar-item" + settingsActive}
                onClick={() => this.props.changeTab("settings")}
              >
                <MdSettings />
                <span>Settings</span>
              </button>
              <button
                className={"navbar-item" + addonsActive}
                onClick={() => this.props.changeTab("addons")}
              >
                <MdOutlineExtension />
                <span>Add-ons</span>
              </button>
              <button
                className={"navbar-item" + marketplaceActive}
                onClick={() => this.props.changeTab("marketplace")}
              >
                <MdOutlineShoppingBasket />
                <span>Marketplace</span>
              </button>
            </div>
            {this.props.children.map((tab) => {
              if (tab.props.label !== this.state.currentTab) {
                return undefined;
              }

              return tab.props.children;
            })}
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}
