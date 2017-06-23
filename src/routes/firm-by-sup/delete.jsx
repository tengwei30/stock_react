
import React from 'react';
import { routerRedux } from 'dva/router';
import { requestError } from '../../components/notify';
import { connect } from '../../core';
import { Icon, ListView, Toast } from 'antd-mobile';
import styles from './delete.less';


class Delete extends React.Component {
  constructor( props ) {
    super( props );
    const dataSource = new ListView.DataSource({
      rowHasChanged: ( row1, row2 ) => row1 !== row2
    });
    this.state = {
      dataSource: dataSource.cloneWithRows( this.props.editsup.addList ),
      loading: true
    };
  }


  componentWillReceiveProps( nextProps ) {
    if ( this.props.editsup.addList !== nextProps.editsup.addList ) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows( nextProps.editsup.addList )
      });
    }
  }


  goDetails( rowData ) {
    this.props.dispatch(
      routerRedux.push( `/sup/details-sup/${this.props.supplierid}` )
    );
    // 商品详情页
    this.props.dispatch({
      type: 'editsup/show',
      payload: rowData
    });
  }
  /* 删除*/
  handleRemove( rowData ) {
    this.props.dispatch({
      type: 'editsup/remove',
      payload: rowData
    });
  }

  render() {
    const row = ( rowData, rowID ) => {
      const oramount = rowData.orderamount;
      const checkamount = rowData.checkamount;
      let chknum = oramount - checkamount;
      if ( chknum <= 0 ) {
        chknum = 0;
      } else {
        chknum = Math.floor( chknum );
      }
      return (
        <div className={styles.listWrapper}>
          <div className={styles.prefaceWrapper} onClick={() => this.handleRemove( rowData )}>
            <Icon type={require( '../../assets/icon/delete.svg' )} className={styles.icon} />
          </div>

          <div className={styles.infoWrapper} onClick={() => this.goDetails( rowData )} >
            <div style={{
              fontSize: '.24rem',
              fontWeight: '500',
              marginBottom: '.1rem' }} >
              {rowData.billno}
            </div>
            <div>
              <span className={styles.date}>
                {rowData.materialname}&nbsp;&nbsp;{rowData.materialrule}
              </span>
              <span className={styles.date} >
                订单量:{rowData.orderamount}
              </span>
            </div>
            <div>
              <span>
                {rowData.dmname || rowData.housename}&nbsp;&nbsp;
                <a style={rowData.checkcomplete ? { color: '#000' } : { color: '#f00' }}>{rowData.checkcomplete ? '已完成' : '未完成' }</a>
              </span>
              <span className={styles.date} >
                已验量:{rowData.checkamount || '0'}
              </span>
            </div>
          </div>
          <div className={styles.num}>
            <span style={( rowData.amount || chknum ) <= 0 ? { color: '#f00', marginRight: '.3rem' } : { color: 'blue', marginRight: '.3rem' }}>
              {
                 rowData.amount || Math.max( 0, Math.floor( rowData.orderamount - rowData.checkamount ))
              }
            </span>
          </div>
        </div>
      );
    };
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderFooter={() => <div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.Loading ? '加载中...' : '暂无更多数据'}
        </div>}
        style={{
          height: 'calc(100vh - 1.68rem)',
          overflow: 'hidden'
        }}
        renderRow={row}
        className="am-list"
        initialListSize={50}
        pageSize={20}
        scrollRenderAheadDistance={500}
        scrollEventThrottle={20}
        onEndReachedThreshold={10} />
    );
  }
}

function editsup({ editsup }) {
  return { editsup };
}

export default connect( editsup )( Delete );
