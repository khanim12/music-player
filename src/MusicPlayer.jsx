import React, { useEffect, useRef, useState } from "react";
import get1 from "./assets/music/get1.mp3";
import takyon from "./assets/music/takyon.mp3";
import nightfall from "./assets/music/nightfall.mp3";
import fever from "./assets/music/fever.mp3";
import foot from "./assets/music/foot.mp3";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";

const datas = [
  { id: 1, name: "Get Got", src: get1 },
  { id: 2, name: "Takyon", src: takyon },
  { id: 3, name: "Nightfall-future", src: nightfall },
  { id: 4, name: "The Fever", src: fever },
  { id: 5, name: "I've Seen", src: foot },
];

function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoriteMusics, setFavoriteMusics] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const currentMusic = datas[currentIndex];
  const audioRef = useRef();
  useEffect(() => {
    const savedFav = localStorage.getItem("favorites");
    if (savedFav) {
      try {
        setFavoriteMusics(JSON.parse(savedFav));
      } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
      }
    }
  }, []);
  useEffect(() => {
    const audio = new Audio(currentMusic.src);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    return () => {
      audio.pause();
    };
  }, [currentIndex]);
  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };
  const nextMusic = () => {
    setCurrentIndex((prevMusic) => (prevMusic + 1) % datas.length);
    setIsPlaying(false);
  };
  const prevMusic = () => {
    setCurrentIndex(
      (prevMusic) => (prevMusic - 1 + datas.length) % datas.length
    );
  };
  const ToggleFavorite = () => {
    const updateFav = favoriteMusics.includes(currentMusic.src)
      ? favoriteMusics.filter((song) => song !== currentMusic.src)
      : [...favoriteMusics, currentMusic.src];
    setFavoriteMusics(updateFav);
    localStorage.setItem("favorites", JSON.stringify(updateFav));
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  return (
    <div className="music">
      <h1>Music</h1>
      <h3>{currentMusic.name}</h3>
      <div className="content">
        <div className="time">
          <span>{formatTime(currentTime)}</span>
          <input
            className="range"
            type="range"
            max={duration}
            min={0}
            onChange={handleSeek}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="btns">
          <div className="btns-player">
            <button onClick={prevMusic}>
              <IoIosArrowBack />
            </button>
            <button className="play" onClick={isPlaying ? pause : play}>
              {isPlaying ? <FaCirclePause /> : <FaCirclePlay />}
            </button>
            <button onClick={nextMusic}>
              <IoIosArrowForward />
            </button>
          </div>
          <button className="fav" onClick={ToggleFavorite}>
            {favoriteMusics.includes(currentMusic.src) ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
