import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
// import "./Section01.css"; // Để các hiệu ứng hoạt động, cần phải có thư viện CSS transition

const Section01 = ({
  users,
  userClient,
  numberBegin,
  handleReadyClick,
  handleUpdateNewElenment,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  const transitionStyles = {
    entering: {
      maxHeight: "1000px",
      transition: "max-height 2000ms ease-in-out",
    },
    entered: {
      maxHeight: "1000px",
      transition: "max-height 2000ms ease-in-out",
    },
    exiting: { maxHeight: "0", transition: "max-height 300ms ease-in-out" },
    exited: { maxHeight: "0", transition: "max-height 300ms ease-in-out" },
  };

  return (
    <div id="section01" className="row">
      <div
        style={{ backgroundColor: userClient.isPause ? "gray" : "transparent" }}
      >
        {numberBegin === 0 ? (
          <div>
            {users.map((e, i) => (
              <div
                style={
                  userClient.id === e.id
                    ? {
                        border: "6px solid green",
                        borderRadius: "5px",
                        width: "20%",
                        padding: "20px",
                      }
                    : {}
                }
                key={i}
              >
                {e.isReady ? "Đã sẵn sàng" : "Chưa sẵn sàng"}
              </div>
            ))}
            <hr />
            <button className="btn btn-primary" onClick={handleReadyClick}>
              Sẵn sàng bắt đầu
            </button>
          </div>
        ) : (
          <>
            {" "}
            <button
              style={{ borderRadius: "5px", width: "100px" }}
              onClick={() => {
                if (userClient.isPause) {
                  handleUpdateNewElenment("incrementReady", true);
                } else {
                  //Setsocre-1
                }
                handleUpdateNewElenment("isPause", !userClient.isPause);
              }}
            >
              {userClient.isPause ? "Tiếp tục" : "Tạm dừng"}
            </button>
            <span>
              {" "}
              Lượt: {numberBegin} / Điểm: {userClient.score}
            </span>
            {countUserStates(users)}
            <button
              className="btn"
              onClick={toggleContent}
              style={{ cursor: "pointer", float: "right" }}
            >
              {isOpen ? (
                <i className="bi bi-caret-up-fill"></i>
              ) : (
                <i className="bi bi-caret-down-fill"></i>
              )}
            </button>
          </>
        )}
      </div>

      <div style={{ width: "100%" }}>
        <CSSTransition
          in={isOpen}
          timeout={2000}
          classNames="content"
          unmountOnExit
        >
          {(state) => (
            <div
              style={{
                ...transitionStyles[state],
                overflow: "hidden",
                width: "100%",
              }}
            >
              <hr />
              <input
                className="form-control"
                type="text"
                placeholder="Chat with others or update name | Enter"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateNewElenment("name", e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <table className="table">
                <thead>
                  <tr>
                    <th>Điểm</th>
                    <th>Chat</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i}>
                      <td>
                        {user.score} | {user.win}
                      </td>

                      <td>{user.name}</td>
                      <td>
                        {" "}
                        {user.isPause ? (
                          <b>Đang tạm dừng</b>
                        ) : user.incrementReady ? (
                          <b>Đang sẵn sàng</b>
                        ) : (
                          <b>Đang làm bài</b>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CSSTransition>
      </div>
    </div>
  );
};

export default Section01;

const countUserStates = (users) => {
  const counts = users.reduce(
    (acc, user) => {
      if (!user.isPause && !user.incrementReady) {
        acc.doing += 1;
      }
      if (user.isPause) {
        acc.pause += 1;
      }
      return acc;
    },
    { doing: 0, pause: 0 }
  );

  return (
    <span style={{ marginLeft: "10px" }}>
      <b>
        {counts.doing}/{users.length - counts.pause} Đang làm bài{" "}
        {counts.pause > 0 ? " | " + counts.pause + " Tạm dừng" : null}
      </b>{" "}
      {/* <i>
        { > 0 ? `Đang làm bài: ${counts.doing}` : "Đều sẵn sàng"}
      </i> */}
    </span>
  );
};
