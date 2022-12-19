!function($) {

  const positions = [
    {
      /** 1 */
      web: {
        back: [0, 2.01],
        now: [2.03, 5.90],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [2.07, 6.00],
        forward: [6.12, 7.03],
      }
    },
    {
      /** 2 */
      web: {
        back: [0, 2.01],
        now: [8.05, 11.90],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [62.00, 65.00],
        forward: [6.12, 7.03],
      }
    },
    {
      /** 3 */
      web: {
        back: [0, 2.01],
        now: [14.00, 16.00],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [48.80, 51.40],
        forward: [6.12, 7.03],
      }
    },
    {
      /** 4 */
      web: {
        back: [0, 2.01],
        now: [26.20, 29.90],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [26.20, 29.90],
        forward: [6.12, 7.03],
      }
    },
    {
      /** 5 */
      web: {
        back: [0, 2.01],
        now: [48.57, 51.40],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [48.57, 51.40],
        forward: [6.12, 7.03],
      }
    },
    {
      /** 6 */
      web: {
        back: [0, 2.01],
        now: [61.50, 65.00],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [61.50, 65.00],
        forward: [6.12, 7.03],
      }
    },
    {
      /** 7 */
      web: {
        back: [0, 2.01],
        now: [61.50, 65.00],
        forward: [6.12, 7.03],
      },
      mobile: {
        back: [0, 2.01],
        now: [61.50, 65.00],
        forward: [6.12, 7.03],
      }
    }
  ];
  let startTimeWeb = 0;
  let endTimeWeb = 0;
  let startTimeMobile = 0;
  let endTimeMobile = 0;

  startTimeWeb = positions[0].web.now[0];
  endTimeWeb = positions[0].web.now[1];
  startTimeMobile = positions[0].mobile.now[0];
  endTimeMobile = positions[0].mobile.now[1];

  $("#video-hero").bind("timeupdate", function () {
    if (this.currentTime > endTimeWeb)
      this.currentTime = startTimeWeb;
    if (this.currentTime < startTimeWeb)
      this.currentTime = startTimeWeb;
  });

  $("#video-hero-mobile").bind("timeupdate", function () {
    if (this.currentTime > endTimeMobile)
      this.currentTime = startTimeMobile;
    if (this.currentTime < startTimeMobile)
      this.currentTime = startTimeMobile;
  });

  $('.main').onepage_scroll({
    sectionContainer: 'section',
    easing: 'ease',
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    beforeMove: (index) => {
      console.log({index});
      startTimeWeb = positions[index - 1].web.now[0];
      endTimeWeb = positions[index - 1].web.now[1];
      startTimeMobile = positions[index - 1].mobile.now[0];
      endTimeMobile = positions[index - 1].mobile.now[1];
    },
    afterMove: (index) => {
      console.log({x: index})
    },
    loop: false,
    keyboard: true,
    responsiveFallback: false,
    direction: 'vertical'
  });
}(window.jQuery);
