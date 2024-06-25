import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import T0_linkApi from "../ulti/T0_linkApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const pracEnSets = [
  {
    root: "learninghub",
    preName: "Trình độ Sơ cấp:",
    name: "Cùng thực hành nghe nói 10 chủ đề giao tiếp cơ bản",
    link: "elementary-a1-lesson-plan",
  },
];

export default function Header({ sttRoom }) {
  if (sttRoom) {
    return null;
  }
  return (
    <div id="headerID">
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link className="my-link" to="/" id="homeHeader">
              <img
                src="https://i.postimg.cc/vB1qBy2X/logo-N.png"
                width={"60px"}
              />
              <b id="homeHeader">
                <i className="A0_01_topcontent">
                  <span style={{ color: "blue" }}>{"   "} Cùng thực hành </span>
                </i>
              </b>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {returnDropdown(
                "Giáo án giao tiếp",
                pracEnSets,
                { name: "name", link: "link", preName: "preName" },
                null
              )}

              {/* {returnDropdown("Khác", [], { name: "name", link: "link" }, null)} */}
            </Nav>
            {/* <Move /> */}
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

function returnDropdown(name, inputSets, keysSets, link) {
  return (
    <NavDropdown title={name} id="basic-nav-dropdown">
      {inputSets.map((e, i) =>
        (() => {
          const urlPath =
            e.root !== null
              ? `/${e.root}/` + e[keysSets.link]
              : `/${e[keysSets.link]}`;
          return (
            <NavDropdown.Item key={i} as={Link} to={urlPath}>
              {e[keysSets.preName] ? (
                <span
                  style={{
                    width: "120px",
                    borderBottom: "1px solid black",
                    display: "inline-block",
                  }}
                >
                  <i>{e[keysSets.preName]}</i>
                </span>
              ) : null}
              {e[keysSets.name]}
            </NavDropdown.Item>
          );
        })()
      )}
    </NavDropdown>
  );
}
