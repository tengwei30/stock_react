import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from '../../core';
import styles from './index.less';


class SelStoreOrder extends React.Component {

  componentDidMount() {
    window.setDocumentTitle( '选择' );
  }

  goStore( filter ) {
     // console.log(filter)
    this.props.dispatch({
      type: 'editbill/store',
      payload: {
        filter
      }
    });
    this.props.dispatch(
      routerRedux.replace( `/order/chk-list-by-order/${this.props.storeList[0].billno}` )
    );
  }


  render() {

    const { filter, storeList } = this.props;
    const arr = storeList.reduce(( arr, item ) => {
      const length = arr.filter(({ dmcode }) => item.dmcode === dmcode ).length;
      if ( length === 0 ) {
        arr.push({
          dmname: item.dmname,
          dmcode: item.dmcode,
          housename: item.housename
        });
      }
      return arr;
    }, []);

    return (
      <div style={{ backgroundColor: '#626264' }}>
        <div className={styles.myStore}>
          <p>部门/库房列表</p>
          <span
            onClick={() => this.goStore( '' )}
            className={!filter ? styles.selected : ''}>
            全部
          </span>
          {arr.map(({ dmname, dmcode, housename }, dmid ) => {
            return (
              <span
                key={`${dmid}`}
                onClick={() => this.goStore( dmcode )}
                className={dmcode === filter ? styles.selected : ''}>
                {dmname || housename}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ editbill }) {
  return {
    filter: editbill.filter,
    storeList: editbill.storeList
  };
}

export default connect( mapStateToProps )( SelStoreOrder );
