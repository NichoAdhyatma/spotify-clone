import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";

const Volume = () => {
  const [{ token }] = useStateProvider();
  const setVolume = async (e) => {
    await axios
      .put("https://api.spotify.com/v1/me/player/volume", null, {
        params: {
          volume_percent: parseInt(e.target.value),
        },
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        if (err.response.status) {
          toast("PREMIUM REQUIRED", {
            closeButton: true,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };
  return (
    <Container>
      <input type="range" min={0} max={100} onChange={(e) => setVolume(e)} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: end;
  align-content: center;
  input {
    width: 15rem;
    border-radius: 2rem;
    height: 0.5rem;
  }
`;

export default Volume;
