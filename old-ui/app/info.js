const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../../ui/app/actions')

module.exports = connect(mapStateToProps)(InfoScreen)

function mapStateToProps (state) {
  return {}
}

inherits(InfoScreen, Component)
function InfoScreen () {
  Component.call(this)
}

InfoScreen.prototype.render = function () {
  const state = this.props
  const version = global.platform.getVersion()

  return (
    h('.flex-column.flex-grow', {
      style: {
        maxWidth: '400px',
      },
    }, [

      // subtitle and nav
      h('.section-title.flex-row.flex-center', [
        h('i.fa.fa-arrow-left.fa-lg.cursor-pointer', {
          onClick: (event) => {
            state.dispatch(actions.goHome())
          },
        }),
        h('h2.page-subtitle', 'Info'),
      ]),

      // main view
      h('.flex-column.flex-justify-center.flex-grow.select-none', [
        h('.flex-space-around', {
          style: {
            padding: '20px',
          },
        }, [
          // current version number

          h('.info.info-gray', [
            h('div', 'MOACmask'),
            h('div', {
              style: {
                marginBottom: '10px',
              },
            }, `Version: ${version}`),
          ]),

          h('div', {
            style: {
              marginBottom: '5px',
            }},
            [
              h('div', [
                h('a', {
                  href: 'https://github.com/MOACChain/MOACMask/blob/master/privacy.md',
                  target: '_blank',
                  onClick: (event) => { this.navigateTo(event.target.href) },
                }, [
                  h('div.info', 'Privacy Policy'),
                ]),
              ]),
              h('div', [
                h('a', {
                  href: 'https://github.com/MOACChain/MOACMask/blob/master/terms.md',
                  target: '_blank',
                  onClick: (event) => { this.navigateTo(event.target.href) },
                }, [
                  h('div.info', 'Terms of Use'),
                ]),
              ]),
              h('div', [
                h('a', {
                  href: 'https://github.com/MOACChain/MOACMask/blob/master/attributions.md',
                  target: '_blank',
                  onClick: (event) => { this.navigateTo(event.target.href) },
                }, [
                  h('div.info', 'Attributions'),
                ]),
              ]),
            ]
          ),

          h('hr', {
            style: {
              margin: '10px 0 ',
              width: '7em',
            },
          }),

              h('div', [
                h('a', {
                  href: 'https://moac.io/',
                  target: '_blank',
                }, [
                  h('img.icon-size', {
                    src: 'images/moac-128.png',
                    style: {
                      // IE6-9
                      filter: 'grayscale(100%)',
                      // Microsoft Edge and Firefox 35+
                      WebkitFilter: 'grayscale(100%)',
                    },
                  }),
                  h('div.info', 'Visit our web site'),
                ]),
              ]),

              h('div.fa.fa-envelope', [
                h('a.info', {
                  target: '_blank',
                  style: { width: '85vw' },
                  href: 'mailto:moacmask@gmail.com?subject=Feedback',
                }, 'Email us!'),
              ]),
            ]),
        ]),
      ]),
    ])
  )
}

InfoScreen.prototype.navigateTo = function (url) {
  global.platform.openWindow({ url })
}

