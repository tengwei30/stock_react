import React from 'react';
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import { connect, session, storage, config } from '../../core';
import { createForm } from 'rc-form';
import styles from './index.less';
import AllCheck from './all-check';

class ChkListByOrder extends React.Component {
  constructor( props ) {
    super( props );
    console.log( this.props.editbill.title );
    // localStorage.setItem('key',JSON.stringify(this.props.params));
    // console.log(this.props.params)
    // const dataSource = new ListView.DataSource({
    //   rowHasChanged: ( row1, row2 ) => row1 !== row2
    // });
    // this.state = {
    //   dataSource: dataSource.cloneWithRows([]),
    //   loading: true
    // };
    // if(props=''){
    //   goList( res ) {
    //     this.props.dispatch(
    //       routerRedux.push( `/order/chk-list-by-order/${res.billno}` )
    //     );
    //     this.props.dispatch({
    //       type: 'editbill/remain',
    //       payload: res
    //     });
    //     // console.log(rowData)
    //   }

    //  }
  }
   // getDetails( orderno ) {
   //    this.props.asyncAjax( 'pur_order_getbyparam', {
   //      data: {
   //        orderno,
   //        topnum: 50
   //      }
   //    })
   //    .before(() => {
   //      Toast.loading( '加载中...', 0 );
   //      this.setState({
   //        loading: true
   //      });
   //    })
   //    .done(( res ) => {
   //      Toast.hide();
   //      this.setState({
   //        loading: false,
   //        dataSource: this.state.dataSource.cloneWithRows( res.data.items )
   //      });
   //    })
   //    .fail(( err ) => {
   //      Toast.hide();
   //      this.props.dispatch( requestError({ err }));
   //    })
   //    .catch(( err ) => {
   //      Toast.hide();
   //      this.props.dispatch( requestError({ err }));
   //    });
   //  }
  componentDidMount( props ) {
    window.setDocumentTitle( '验收列表' );
  }

  goFirm =() => {
    if ( this.props.editbill.addList.length === 0 ) {
      return Toast.info( '请至少选择一个商品!' );
    }
    this.props.dispatch(
      routerRedux.push( `/order/firm-by-order/${this.props.params.billno}` )
    );
  }
  goStore() {
    this.props.dispatch(
      routerRedux.push( '/order/sel-store-order' )
    );
  }

  render() {
    // const _billno = storage.get( config.keys.USER_INFO );
    // const _supName = storage.get( config.keys.SUP_NAME );
    // const _orderDate = storage.get( config.keys.MESSAGE_ORDER );
    // const _orderMoney = session.get( config.keys.USER_INFO );
    // const _progress = session.get( config.keys.USER_INFO);
    return ( <div>
      <div>
        <ul style={{
          display: 'inline-block',
          fontSize: '.3rem',
          margin: '.2rem' }}>
          <li>
            <span style={{ fontSize: '.3rem', marginTop: '.2rem' }}>
              订单信息：{this.props.editbill.title.billno}&nbsp;&nbsp;{this.props.editbill.title.suppliername}
            </span>
          </li>
        </ul>
      </div>
      <hr style={{ margin: '0rem' }} />
      <span style={{
        color: '#108EE9',
        display: 'inline-block',
        fontSize: '.3rem',
        margin: '.2rem' }}
        onClick={::this.goStore}>
        筛选部门/库房
      </span>
      <div className={styles.typename}>
        <span style={{ width: '40%' }}>商品/班组/状态</span>
        <span style={{ width: '30%' }}>进价/售价</span>
        <span style={{ width: '20%' }}>验收情况</span>
      </div>
      <AllCheck billno={this.props.params.billno} />
      <div style={{
        width: '100%',
        display: 'relative',
        position: 'fixed',
        bottom: '0px' }}>
        <ul className={styles.textbody}>
          <li style={{ borderTop: '1px solid #ddd' }}>
            <span style={{ fontSize: '.24rem', marginTop: '.2rem' }}>
              订单日期：{this.props.editbill.title.orderdate}&nbsp;&nbsp;
              订单金额：￥{this.props.editbill.title.orderoutmoney}&nbsp;
              <a style={( this.props.editbill.title.checkprogress ) === 100
                      ? { color: '#000', position: 'absolute', right: '0px', marginRight: '30px' }
                      : { color: '#f00', position: 'absolute', right: '0px', marginRight: '30px' }
                    }>
                {`${this.props.editbill.title.checkprogress == null ? '0' : this.props.editbill.title.checkprogress}%`}
              </a>
            </span>
          </li>
        </ul>
        <button
          onClick={() => this.goFirm()}
          style={{
            width: '100%',
            backgroundColor: '#2DB245',
            height: '.8rem',
            fontSize: '0.28rem',
            color: '#fff',
            border: 'none' }}>确认
        </button>
      </div>
    </div> );
  }
}

function editbill({ editbill }) {
  return { editbill };
}

const ChkListByOrderComponent = createForm()( ChkListByOrder );

export default connect( editbill )( ChkListByOrderComponent );
