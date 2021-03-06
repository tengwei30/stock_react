import React from 'react';
import { ListView, Toast, Checkbox, SwipeAction, List } from 'antd-mobile';
import { requestError } from '../../components/notify';
import { createForm } from 'rc-form';
import { connect, session, config } from '../../core';
import styles from './all-check.less';

const CheckboxItem = Checkbox.CheckboxItem;


class AllCheck extends React.Component {
  constructor( props ) {
    super( props );
    const dataSource = new ListView.DataSource({
      rowHasChanged: ( row1, row2 ) => row1 !== row2
    });
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      loading: true,
      rowData: null,
      text: '确认收获',
      style: { backgroundColor: '#090', color: 'white' }
    };
  }

  componentDidMount() {
    this.getContent();
    window.setDocumentTitle( '验收列表--按订单号' );
  }
  // 获取订单明细
  // orderdate:计划日期
  // supplierid:供应商(-1: 全部)
  // dmid:部门(-1: 全部)
  // state:状态(-1：全部 1：未验收 2：已验收)
  // orderno:订单号 模糊查询
  getContent() {
    this.props.asyncAjax( 'check_order_details', {
      data: {
        orderdate: '',
        supplierid: -1,
        dmid: -1,
        state: -1,
        orderno: this.props.billno,
        wheresql: '',
        pageindex: 1,
        pagesize: 1000,
        sortfields: ''
      }
    })
    .before(() => {
      Toast.loading( '加载中...', 0 );
      this.setState({
        loading: true
      });
    })
    .done(( res ) => {
      Toast.hide();
      let list = [];
      if ( this.props.editbill.filter !== '' ) {
        list = res.data.items.filter(({ dmcode }) => dmcode === this.props.editbill.filter );
      } else {
        list = res.data.items;
      }
      list.forEach(( item, index ) => {
        Object.assign( item, { key: `item_${index}` });
      });
      this.props.dispatch({
        type: 'editbill/update',
        payload: {
          list: res.data.items
        }
      });
      this.props.dispatch({
        type: 'editbill/store',
        payload: {
          storeList: res.data.items
        }
      });
      this.setState({
        loading: false,
        dataSource: this.state.dataSource.cloneWithRows( list )
      });
    })
    .fail(( err ) => {
      Toast.hide();
      this.props.dispatch( requestError({ err }));
    })
    .catch(( err ) => {
      Toast.hide();
      this.props.dispatch( requestError({ err }));
    });
  }

  onChange = ( rowData ) => {
    this.props.dispatch({
      type: 'editbill/addBill',
      payload: rowData
    });
    // console.log(rowData)
  };

  handleConfirm = ( rowData, tag ) => {
    this.props.asyncAjax( 'firm_order', {
      data: {
        orderguidlist: rowData.orderguid,
        tag
      }
    })
    .before(() => {
      Toast.loading( '加载中...', 0 );
    })
    .done(() => {
      Toast.hide();
      this.props.dispatch({
        type: 'editbill/confirm',
        payload: {
          orderguid: rowData.orderguid,
          tag
        }
      });
    })
    .fail(( err ) => {
      Toast.hide();
      this.props.dispatch( requestError({ err }));
    })
    .catch(( err ) => {
      Toast.hide();
      this.props.dispatch( requestError({ err }));
    });
  };

  render() {

    const row = ( rowData, rowID ) => {
      const isCheck = this.props.editbill.addList.filter(({ orderguid }) => rowData.orderguid === orderguid );
      const buttonStyle = {};
      if ( rowData.checkcomplete ) {
        buttonStyle.text = '取消确认';
        buttonStyle.style = { backgroundColor: 'red', color: 'white' };
      } else {
        buttonStyle.text = '确认收货';
        buttonStyle.style = { backgroundColor: '#090', color: 'white' };
      }

      return (
        <div key={rowID} className="row">
          <SwipeAction
            style={{ backgroundColor: 'gray' }}
            autoClose
            right={[{
              ...buttonStyle,
              onPress: () => this.handleConfirm( rowData, !rowData.checkcomplete ? 1 : 0 )
            }]} >
            <CheckboxItem key={rowID} onChange={() => this.onChange( rowData )} defaultChecked={isCheck.length > 0} >
              <div className={styles.infoWrapper}>
                <div>
                  <span className={styles.date}>
                    {rowData.materialname}&nbsp;&nbsp;{rowData.materialrule}
                  </span>
                  <span className={styles.date} style={{ marginLeft: '.3rem' }}>
                    {rowData.inprice}元/{rowData.unitname}
                  </span>
                  <span className={styles.date} style={{ marginLeft: '-.5rem' }}>
                    订单量:{rowData.orderamount}
                  </span>
                </div>
                <div>
                  <span>
                    {rowData.dmname || rowData.housename}&nbsp;&nbsp;
                    <a style={rowData.checkcomplete ? { color: '#000' } : { color: '#f00' }}>{rowData.checkcomplete ? '已完成' : '未完成' }</a>
                  </span>
                  <span className={styles.date} style={{ marginLeft: '.3rem' }}>
                    {rowData.outprice}元/{rowData.unitname}
                  </span>
                  <span className={styles.date} style={{ marginLeft: '-.5rem' }}>
                    已验量:{rowData.checkamount || '0'}
                  </span>
                </div>
              </div>
            </CheckboxItem>
          </SwipeAction>
        </div>
      );


    };
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderFooter={() => <div style={{ textAlign: 'center' }}>
          {this.state.isLoading ? '加载中...' : '暂无更多数据'}
        </div>}
        style={{
          height: 'calc(100vh - 3.5rem)'
        }}
        renderRow={row}
        className="am-list"
        initialListSize={50}
        pageSize={20}
        scrollRenderAheadDistance={100}
        scrollEventThrottle={20}
        onEndReachedThreshold={10} />
    );
  }
}

function editbill({ editbill }) {
  return { editbill };
}

const AllCheckComponent = createForm()( AllCheck );

export default connect( editbill )( AllCheckComponent );
