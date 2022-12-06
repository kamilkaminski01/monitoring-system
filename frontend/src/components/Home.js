import React from "react";
import Card from "./Card";
import "./css/App.css";

function Home() {
  return (
    <div className="App">
      <h1>Monitoring System</h1>
      <Card
        title="Whiteboard"
        imageUrl="https://picsum.photos/300"
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        link="http://localhost:3000/whiteboard"
      />
    </div>
  );
}

export default Home;
