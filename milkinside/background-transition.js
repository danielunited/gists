!function($) {

  const hashValue = parseInt(window.location.hash.replace('#',''));
  const frameGap = 0.25; /** gap front and end of loop, intro and outro */
  const positions = []; /** collective timeframe supplied at the section area of the template */
  const videos = $("#video-hero, #video-hero-mobile");
  $('.main .section').toArray().forEach(dom => {
    positions.push({
      forward: [$(dom).attr('transitionstart'), $(dom).attr('transitionend')],
      now: [$(dom).attr('loopstart'), $(dom).attr('loopend')],
      back: [$(dom).attr('transitionstartbackward'), $(dom).attr('transitionendbackward')],
    })
  });

  let currentIndex = hashValue ? hashValue - 1 : 0;
  let deltaIndex = currentIndex;
  let startTimeWeb = 0;
  let endTimeWeb = 0;
  let isSkip = false;

  const convertTime = (time) => {
    const [min, sec, frames] = time.split(':')
    /** MINUTES:SECONDS:HUNDREDTHS */
    return parseFloat(Math.max((parseInt(min) * 60) + parseInt(sec) + ((parseInt(frames) /100)),.01).toFixed(3))
  };

  const convertTimeRange = (timeRange) => {
    return [convertTime(timeRange[0]) + frameGap, convertTime(timeRange[1]) - frameGap];
  };

  const initializeVideo = () => {
    $('.trigger').click((event) => {
      videos.each(i => {
        videos[i].pause();
        if (!$(videos[i]).is(":hidden")) {
          videos[i].play()
            .then(() => {
              videos[i].pause();
              console.warn('Browser with Autoplay');
              setTimeout(() => {
                videos[i].play();
                videos[i].onended = function () {
                  this.load();
                  this.play();
                };
              }, loaderDuration * 1000);
            }).catch(() => {
              console.warn('Browser without Autoplay');
              setTimeout(() => {
                videos[i].play();
                videos[i].onended = function () {
                  this.load();
                  this.play();
                };
              }, loaderDuration * 1000);
            })
        }
      });
    });
  };

  let playQueue = [
    convertTimeRange(positions[currentIndex].forward),
    convertTimeRange(positions[currentIndex].forward),
    convertTimeRange(positions[currentIndex].now)
  ];

  videos.bind("timeupdate", function () {
    if (this.currentTime > endTimeWeb) {
      /** remove top playable */
      if (playQueue.length > 1) {
        playQueue.shift();
      }
      /** feed next playable */
      [ startTimeWeb, endTimeWeb, deltaIndex ] = playQueue[0];
      this.currentTime = startTimeWeb;

      if (playQueue.length <= 2 && $('.main').hasClass('transition-fade-out')) {
        const transitionLength = endTimeWeb - startTimeWeb + frameGap;
        /** main transition marker */
        $('.main').removeClass('transition-fade-out');
        /** transition fade in video background */
        setTimeout(() => {
          $(this).css({
            'transition': `opacity ${transitionLength}s ease-in-out`,
            '-moz-transition': `opacity ${transitionLength}s ease-in-out`,
            '-webkit-transition': `opacity ${transitionLength}s ease-in-out`,
            'opacity': 1
          }, frameGap * 1000);
        })
      }
    }
    /** stabilize currentTime */
    if (this.currentTime < startTimeWeb) {
      this.currentTime = startTimeWeb;
    }
    if (isSkip) {
      const transitionLength = endTimeWeb - this.currentTime + frameGap;
      /** main transition marker */
      $('.main').addClass('transition-fade-out');
      /** transition fade out video background */
      setTimeout(() => {
        $(this).css({
          'transition': `opacity ${transitionLength}s ease-in-out`,
          '-moz-transition': `opacity ${transitionLength}s ease-in-out`,
          '-webkit-transition': `opacity ${transitionLength}s ease-in-out`,
          'opacity': 0
        });
      }, frameGap * 1000);
      isSkip = false;
    }
  });

  let processing = false;
  $('.main').onepage_scroll({
    sectionContainer: 'section',
    easing: 'none',
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    beforeMove: (index) => {
      if (!processing) {
        processing = true;
        this.disabled = true;
        const isForward =  currentIndex < (index - 1);
        const currentIndexPointer = (index - 1);
        let playQueueFeed = [... playQueue];
        isSkip = Math.abs(currentIndex - currentIndexPointer) > 1;
        /** insert backward and forward then loop */
        for (
          let i = currentIndex;
          isForward ? i <= currentIndexPointer: i >= currentIndexPointer;
          isForward ? i++ : i--
        ) {
          if (i !== currentIndex && currentIndexPointer === i) {
            if (isForward && positions[i]) {
              playQueueFeed.push([ ... convertTimeRange(positions[i].forward), i]);
            } else {
              if (positions[i + 1]) {
                playQueueFeed.push([ ... convertTimeRange(positions[i + 1].back), i + 1]);
              }
            }
            if (positions[i]) {
              playQueueFeed.push([ ... convertTimeRange(positions[i].now), i]);
            }
          }
        }
        /** always take the last 3 only */
        if (playQueueFeed.length > 3) {
          playQueueFeed = playQueueFeed.slice(playQueueFeed.length - 3, playQueueFeed.length);
        }
        currentIndex = index - 1;
        playQueue = playQueueFeed;
        processing = false;
      }
    },
    loop: false,
    keyboard: true,
    responsiveFallback: false,
    direction: 'vertical'
  });

  initializeVideo();
}(window.jQuery);
