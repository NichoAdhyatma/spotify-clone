import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import Body from "./Body";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Spotify = () => {
  const [{ token }, dispatch] = useStateProvider();
  const bodyRef = useRef();
  const [navBg, setNavBg] = useState(false);
  const [headerBg, setHeaderBg] = useState(false);

  const bodyScroller = () => {
    bodyRef.current.scrollTop >= 30 ? setNavBg(true) : setNavBg(false);
    bodyRef.current.scrollTop >= 268 ? setHeaderBg(true) : setHeaderBg(false);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const userInfo = {
        userId: data.id,
        userName: data.display_name,
      };
      dispatch({ type: reducerCases.SET_USER, userInfo });
    };
    getUserInfo();
  }, [dispatch, token]);
  
  return (
    <Container>
      <div className="spotify_body">
        <Sidebar />
        <div className="body" ref={bodyRef} onScroll={bodyScroller}>
          <Navbar navBg={navBg} />
          <div className="body_contents">
            <Body headerBg={headerBg} />
          </div>
        </div>
      </div>
      <div className="spotify_footer">
        <Footer />
      </div>
    </Container>
  );
};

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;
  .spotify_body {
    display: grid;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 5rem;
        }
      }
    }
  }
`;

export default Spotify;
