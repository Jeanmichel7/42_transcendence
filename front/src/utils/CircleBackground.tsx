import React from "react";
import { useSelector } from "react-redux";
import "../utils/login.scss";

export function CircleBackground() {
  const isEffectActivated = useSelector(
    (state) => state.game.isEffectActivated
  );
  const colorBackground = isEffectActivated ? "black" : "";
  const colorCircle = isEffectActivated ? "#330207" : "";

  return (
    <div
      className="particle-container"
      style={{ backgroundColor: colorBackground }}
    >
      <div className="particles ">
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <span
              className="circle"
              style={{ backgroundColor: colorCircle }}
              key={i}
            ></span>
          ))}
      </div>
    </div>
  );
}
