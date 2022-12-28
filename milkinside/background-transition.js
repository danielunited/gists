!function($) {

  const positions = [
    {
      /** 1 */
      web: {
        forward: ['00:00:00', '00:00:30'],
        now: ['00:02:02', '00:06:01'],
        back: ['00:01:01', '00:02:01'],
      },
      mobile: {
        forward: ['00:00:00', '00:00:30'],
        now: ['00:02:12', '00:06:11'],
        back: ['00:01:01', '00:02:11'],
      }
    },
    {
      /** 2 */
      web: {
        forward: ['00:06:03', '00:07:02'],
        now: ['00:08:03', '00:12:02'],
        back: ['00:07:03', '00:07:56'],
      },
      mobile: {
        forward: ['00:06:03', '00:07:02'],
        now: ['00:08:13', '00:12:12'],
        back: ['00:07:03', '00:08:12'],
      }
    },
    {
      /** 3 */
      web: {
        forward: ['00:12:03', '00:15:08'],
        now: ['00:18:22', '00:21:14'],
        back: ['00:15:09', '00:18:21'],
      },
      mobile: {
        forward: ['00:12:03', '00:15:08'],
        now: ['00:18:29', '00:21:34'],
        back: ['00:15:09', '00:18:26'],
      }
    },
    {
      /** 4 */
      web: {
        forward: ['00:21:15', '00:23:44'],
        now: ['00:26:14', '00:30:01'],
        back: ['00:23:45', '00:26:03'],
      },
      mobile: {
        forward: ['00:21:34', '00:23:54'],
        now: ['00:26:24', '00:30:01'],
        back: ['00:23:55', '00:25:54'],
      }
    },
    {
      /** 5 */
      web: {
        forward: ['00:30:02', '00:31:05'],
        now: ['00:32:50', '00:36:10'],
        back: ['00:31:16', '00:32:19'],
      },
      mobile: {
        forward: ['00:30:02', '00:31:05'],
        now: ['00:32:50', '00:36:10'],
        back: ['00:31:06', '00:32:09'],
      }
    },
    {
      /** 6 */
      web: {
        forward: ['00:36:11', '00:37:34'],
        now: ['00:38:53', '00:42:11'],
        back: ['00:37:35', '00:38:42'],
      },
      mobile: {
        forward: ['00:36:11', '00:37:34'],
        now: ['00:38:53', '00:42:11'],
        back: ['00:37:35', '00:38:22'],
      }
    },
    {
      /** 7 */
      web: {
        forward: ['00:42:12', '00:45:26'],
        now: ['00:48:34', '00:51:24'],
        back: ['00:45:26', '00:48:28'],
      },
      mobile: {
        forward: ['00:42:12', '00:45:26'],
        now: ['00:48:54', '00:51:44'],
        back: ['00:45:26', '00:48:38'],
      }
    },
    {
      /** 8 */
      web: {
        forward: ['00:51:15', '00:56:14'],
        now: ['01:01:55', '01:05:08'],
        back: ['00:56:25', '01:01:14'],
      },
      mobile: {
        forward: ['00:51:45', '00:56:14'],
        now: ['01:02:05', '01:05:08'],
        back: ['00:56:25', '01:01:14'],
      }
    },
  ];

  let hashValue = parseInt(window.location.hash.replace('#',''));
  const isMobile = $("#video-hero-mobile").is(":visible");
  let currentIndex = hashValue ? hashValue - 1 : 0;
  let deltaIndex = currentIndex;
  let singleFrame = .16;
  let startTimeWeb = 0;
  let endTimeWeb = 0;
  let playbackRate = 1;

  const convertTime = (time) => {
    const [min, sec, mil] = time.split(':')
    return Math.max((parseInt(min) * 60) + parseInt(sec) + (parseInt(mil) / 60),.01).toFixed(3)
  };

  const convertTimeRange = (timeRange) => {
    return [convertTime(timeRange[0]), convertTime(timeRange[1])];
  };

  const playQueue = [
    convertTimeRange(positions[currentIndex ? currentIndex - 1 : 0][isMobile ? 'mobile' : 'web'].forward),
    convertTimeRange(positions[currentIndex ? currentIndex - 1 : 0][isMobile ? 'mobile' : 'web'].now)
  ];

  $("#video-hero, #video-hero-mobile").bind("timeupdate", function () {
    if (this.currentTime > endTimeWeb - singleFrame) {
      if (playQueue.length > 1) {
        playQueue.shift();
      } else {
        this.playbackRate = 1;
        playbackRate = 1;
      }
      [ startTimeWeb, endTimeWeb, deltaIndex ] = playQueue[0];
      this.currentTime = startTimeWeb;
    }
    if (this.currentTime < startTimeWeb) {
      this.currentTime = startTimeWeb;
    }
    this.playbackRate = playbackRate;
  });

  $('.main').onepage_scroll({
    sectionContainer: 'section',
    easing: 'ease',
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    afterMove: (index) => {
      console.log({x: index})
    },
    beforeMove: (index) => {
      this.disabled = true;
      const isForward =  currentIndex < (index - 1);
      const currentIndexPointer = (index - 1);
      for (
        let i = currentIndex;
        isForward ? i <= currentIndexPointer: i >= currentIndexPointer;
        isForward ? i++ : i--
      ) {
        if (i !== currentIndex) {
          if (isForward) {
            if (positions[i]) {
              playQueue.push([ ... convertTimeRange(positions[i][isMobile ? 'mobile' : 'web'].forward), i]);
            }
          } else {
            if (positions[i + 1]) {
              playQueue.push([ ... convertTimeRange(positions[i + 1][isMobile ? 'mobile' : 'web'].back), i + 1]);
            }
          }
          if (positions[i]) {
            playQueue.push([ ... convertTimeRange(positions[i][isMobile ? 'mobile' : 'web'].now), i]);
          }
        }
      }
      currentIndex = index - 1;
      playbackRate = 1;
    },
    loop: false,
    keyboard: true,
    responsiveFallback: false,
    direction: 'vertical'
  });
}(window.jQuery);
