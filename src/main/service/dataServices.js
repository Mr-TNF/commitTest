class DataService {
  constructor($http) {
    console.log('请求Data服务 constructor')
    this.$http = $http
  }

  getData = function () {
    return [{
      name: '导航一',
      id: 1,
      children: [{
        id: 11,
        name: 'L_11',
        children: [
          {
            id: 111,
            name: 'L_p_111'
          },
          {
            id: 112,
            name: 'L_p_112'
          }
        ]
      },
      {
        id: 12,
        name: 'L_12',
        children: [
          {
            id: 121,
            name: 'L_p_121'
          },
          {
            id: 122,
            name: 'L_p_122'
          }
        ]
      }
      ]
    },
    {
      name: '导航二',
      id: 1,
      children: [{
        id: 21,
        name: 'L_21',
        children: [
          {
            id: 211,
            name: 'L_p_211'
          },
          {
            id: 212,
            name: 'L_p_212'
          }
        ]
      },
      {
        id: 12,
        name: 'L_22',
        children: [
          {
            id: 221,
            name: 'L_p_221'
          },
          {
            id: 222,
            name: 'L_p_222'
          }
        ]
      }
      ]
    },
    {
      name: '导航三',
      id: 3,
      children: [{
        id: 31,
        name: 'L_31',
        children: [
          {
            id: 111,
            name: 'L_p_311'
          },
          {
            id: 112,
            name: 'L_p_312'
          }
        ]
      },
      {
        id: 32,
        name: 'L_32',
        children: [
          {
            id: 321,
            name: 'L_p_321'
          },
          {
            id: 322,
            name: 'L_p_322'
          }
        ]
      }
      ]
    },
    {
      name: '导航四',
      id: 4,
      children: [{
        id: 41,
        name: 'L_41',
        children: [{
          id: 411,
          name: 'L_p_411'
        },
        {
          id: 412,
          name: 'L_p_412'
        }
        ]
      },
      {
        id: 42,
        name: 'L_42',
        children: [{
          id: 421,
          name: 'L_p_421'
        },
        {
          id: 422,
          name: 'L_p_422'
        }
        ]
      }
      ]
    }
    ]
  }
}

export default ['$http', DataService]

