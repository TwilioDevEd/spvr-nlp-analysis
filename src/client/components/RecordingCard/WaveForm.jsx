/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import WaveSurfer from 'wavesurfer.js';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  center: {
    textAlign: 'center',
  },
});

export default function WaveForm({ url, onAudioProcessing }) {
  const classes = useStyles();
  const formWaveSurferOptions = (ref) => ({
    container: ref,
    barWidth: 3,
    cursorWidth: 1,
    backend: 'WebAudio',
    height: 200,
    progressColor: '#2D5BFF',
    responsive: true,
    waveColor: '#EFEFEF',
    cursorColor: '#EFEFEF',
  });

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);

  // Create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on('ready', () => {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);
    });

    wavesurfer.current.on('audioprocess', (elapsedTime) =>
      onAudioProcessing(elapsedTime)
    );

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  return (
    <div className={classes.root}>
      <div id="waveform" ref={waveformRef} />
      <div className={classes.center}>
        <IconButton onClick={handlePlayPause} variant="outlined" type="submit">
          {!playing ? (
            <PlayCircleOutlineIcon aria-label="play" />
          ) : (
            <PauseCircleOutlineIcon aria-label="pause" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
