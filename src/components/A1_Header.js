import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import T0_linkApi from "../ulti/T0_linkApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import NewListHref from "./A1_Header_href_EslConversation.json";
import HrefImages from "./A1_Header_href_WithImages.json";
import HrefLearnonyoutube from "./A1_Header_href_Learnonyoutube.json";

const coreKnowledgeSets = [
  {
    root: "coreknowledge",
    preName: "",
    name: "Thông tin - Kiến thức về Ghép âm - tách âm",
    link: "ghep-tach-am",
    id: "socapI",
  },
];

const pracEnSets = [
  {
    root: "learninghub",
    preName: "Khóa Sơ cấp:",
    name: "Cùng thực hành nghe nói 10 chủ đề giao tiếp cơ bản",
    link: "elementary-a1-lesson-plan",
    id: "socapI",
  },
  {
    root: "learninghub",
    preName: "Khóa Sơ cấp:",
    name: "Cùng thực hành nghe nói 10 chủ đề giao tiếp cơ bản ver.01",
    link: "elementary-a1-lesson-plan-ver01",
    id: "socapI",
  },
  {
    root: "learninghub",
    preName: "Khóa tiêu chuẩn:",
    name: "Cùng thực hành nghe nói chủ đề: Ăn - Ở - Đi lại",
    link: "restaurant-hotel-travel",
    id: "socapII",
  },

  {
    root: "learninghub",
    preName: "For parents:",
    name: "Cùng thực hành các nội dung thân thuộc với trẻ em 2-5 tuổi",
    link: "parents-and-kids",
    id: "socapII",
  },
];

export default function Header({ sttRoom, STTconnectFN }) {
  if (sttRoom) {
    return null;
  }
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "8vh",
        top: 0,
        borderBottom: "1px solid black",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.3)", // Thêm giá trị box-shadow
        // scale: "0.8",
      }}
    >
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="https://i.postimg.cc/vB1qBy2X/logo-N.png"
                width={60}
                style={{ marginRight: 10 }} // Khoảng cách bên phải cho hình ảnh logo
                alt="Logo"
              />
              <b style={{ fontSize: 18, fontWeight: "bold" }}>
                <i style={{ color: "blue", fontStyle: "italic" }}>
                  {" "}
                  Cùng thực hành
                </i>
              </b>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {returnDropdown(
                "Kiến thức cốt lõi",
                coreKnowledgeSets,
                { name: "name", link: "link", preName: "preName" },
                null
              )}

              {returnDropdown(
                "Giáo án giao tiếp",
                pracEnSets,
                { name: "name", link: "link", preName: "preName" },
                null
              )}
              {returnDropdown(
                "ESL Conversation",
                NewListHref,
                { name: "name", link: "link", preName: "preName" },
                null
              )}
              {returnDropdown(
                "Từ vựng và Hình ảnh",
                HrefImages,
                { name: "name", link: "link", preName: "preName" },
                null
              )}
              {returnDropdown(
                "Learn on youtube",
                HrefLearnonyoutube,
                { name: "name", link: "link", preName: "preName" },
                null
              )}

              {returnDropdown(
                "Khác",
                [
                  {
                    name: "Cấu hình cài đặt",
                    root: "setting",
                    link: "",
                    preName: "",
                  },
                ],
                { name: "name", link: "link" },
                null
              )}
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
    <NavDropdown
      title={name}
      id="basic-nav-dropdown"
      // className="dropup" // Thêm lớp "dropup" để tạo drop-up
    >
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
                    width: "150px",
                    borderBottom: "1px solid black",
                    display: "inline-block",
                  }}
                >
                  <i>{e[keysSets.preName]}</i>
                </span>
              ) : null}
              {"  "} {e[keysSets.name]}
            </NavDropdown.Item>
          );
        })()
      )}
    </NavDropdown>
  );
}
