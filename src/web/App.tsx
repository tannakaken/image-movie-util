import React, { useState } from "react";
import ReactLoading from "react-loading";
import "./App.css";

export const App = () => {
  const [numberOfDigits, setNumberOfDigits] = useState(4);
  const [webm, setWebm] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "medium" }}>画像&動画処理ツール</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <label htmlFor="numberOfDigits">連番の桁数</label>
          <input
            style={{
              width: "40px",
            }}
            name="numberOfDigits"
            type="number"
            value={numberOfDigits}
            onChange={(event) => {
              const newValue = parseInt(event.target.value, 10);
              if (isNaN(newValue) || newValue < 1) {
                return;
              }
              setNumberOfDigits(newValue);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setProcessing(true);
            setError(null);
            window.nativeApi.requestOpenDir(
              numberOfDigits,
              (createdWebm, error) => {
                setProcessing(false);
                if (createdWebm === null) {
                  setError(error || "何らかのエラーがありました。");
                  return;
                }
                setError(null);
                setWebm(createdWebm);
              }
            );
          }}
        >
          連番
        </button>
      </div>
      {webm && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <video
            autoPlay
            controls
            src={`file://${webm}`}
            width="400px"
            height="300px"
          />
          <button
            type="button"
            onClick={() => {
              window.nativeApi.requestOpenFilePlace(webm);
            }}
          >
            ファイルの場所を開く
          </button>
        </div>
      )}

      <div>
        <p style={{ color: "red" }}>{error}</p>
      </div>
      {processing && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: "auto",
          }}
        >
          <ReactLoading
            color="#ebc634"
            height="50px"
            width="50px"
            type="spin"
          />
        </div>
      )}
    </div>
  );
};
