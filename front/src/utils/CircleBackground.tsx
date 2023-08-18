import React from 'react';
import { useSelector } from 'react-redux';
import '../utils/CircleBakcground.scss';
import { RootState } from '../store';

export function CircleBackground() {
  const effect = useSelector((state: RootState) => state.game.effect);
  const colorBackground = effect === 'black' ? 'black' : '';
  const colorCircle =
    effect === 'black' ? '#330207' : effect === 'red' ? 'red' : '';

  return (
    <div
      className="particle-container"
      style={{ backgroundColor: colorBackground }}
    >
      <div className="particles">
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <span
              className="circle blinking-effect"
              style={{ backgroundColor: colorCircle }}
              key={i}
            ></span>
          ))}
      </div>
    </div>
  );
}
