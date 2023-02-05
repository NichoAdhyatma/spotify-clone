import React, { useEffect } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillInfoCircle } from "react-icons/ai";

const PlayerControls = () => {
  const [{ token, playerState }, dispatch] = useStateProvider();

  useEffect(() => {
    const getPlayBackState = async () => {
      const response = await axios.get(`https://api.spotify.com/v1/me/player`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const playerState = response.data.is_playing;
      dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState });
    };
    getPlayBackState();
  }, [dispatch, token]);

  const changeTrack = async (type) => {
    await axios
      .post(`https://api.spotify.com/v1/me/player/${type}`, null, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        if (err.response.status === 403) {
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

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response !== "") {
      const { item } = response.data;
      const currentPlaying = {
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist) => artist.name),
        image: item.album.images[2].url,
      };
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
    } else {
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
    }
  };

  const changeState = async () => {
    const state = playerState ? "pause" : "play";

    const response = await axios
      .put(`https://api.spotify.com/v1/me/player/${state}`, null, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        if (err.response.status === 403) {
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
        } else {
          dispatch({
            type: reducerCases.SET_PLAYER_STATE,
            playerState: !playerState,
          });
        }
      });
  };

  return (
    <Container>
      <div className="shuffle">
        <BsShuffle />
      </div>
      <div className="previous">
        <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
      </div>
      <div className="state">
        {playerState ? (
          <BsFillPauseCircleFill onClick={changeState} />
        ) : (
          <BsFillPlayCircleFill onClick={changeState} />
        )}
      </div>
      <div className="next">
        <CgPlayTrackNext onClick={() => changeTrack("next")} />
      </div>
      <div className="repeat">
        <FiRepeat />
      </div>
      <ToastContainer />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }

  .state {
    svg {
      color: white;
    }
  }

  .next,
  .state,
  .previous {
    font-size: 2rem;
  }
`;

export default PlayerControls;
