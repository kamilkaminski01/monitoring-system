import React, { useRef, useEffect } from 'react';
import { PATHS, WEBSOCKETS } from 'utils/consts';
import 'apps/Whiteboard/Whiteboard.scss';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(WEBSOCKETS.whiteboard);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const colors = document.getElementsByClassName('color');
    const current = {
      color: 'black'
    };
    let dataURL = '';
    let drawing = false;

    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const drawLine = (x0, y0, x1, y1, color, send) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      if (color === 'white') {
        context.lineWidth = 50;
      } else {
        context.lineWidth = 2;
      }
      context.stroke();
      context.closePath();
      context.save();
      dataURL = canvasRef.current.toDataURL('image/png');

      if (!send) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;

      try {
        socketRef.current.send(
          JSON.stringify({
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color
          })
        );
      } catch {}
    };

    const onMouseMove = (e) => {
      if (!drawing) return;

      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) return;

      drawing = false;
      try {
        drawLine(
          current.x,
          current.y,
          e.clientX || e.touches[0].clientX,
          e.clientY || e.touches[0].clientY,
          current.color,
          true
        );
      } catch {}
    };

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();
        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 5), false);

    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', onMouseMove, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 5), false);

    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = document.createElement('img');
      img.src = dataURL;
      context.drawImage(img, 0, 0);
      context.restore();
    };
    window.addEventListener('resize', onResize, false);
    onResize();

    const onDrawingEvent = (data) => {
      const w = canvas.width;
      const h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    };

    socketRef.current.onmessage = (e) => {
      onDrawingEvent(JSON.parse(e.data));
    };
  }, []);

  return (
    <div className="whiteboard-container">
      <canvas ref={canvasRef} className="whiteboard" />
      <div ref={colorsRef} className="colors">
        <div className="color black" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />
        <div className="color white" />
        <button onClick={() => (window.location.href = PATHS.home)}>HOME</button>
      </div>
    </div>
  );
};

export default Whiteboard;
