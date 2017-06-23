import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from '../../core';
import styles from './index.less';


class SelStoreSup extends React.Component {

  componentDidMount() {
    window.setDocumentTitle( '选择' );
  }

  goStore( filter ) {
    this.props.dispatch({
      type: 'editsup/store',
      payload: {
        filter
      }
    });
    this.props.dispatch(
      routerRedux.replace( `/sup/chk-list-by-sup/${this.props.storeList[0].supplierid}` )
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
          housename: item.housename });
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

function mapStateToProps({ editsup }) {
  return {
    filter: editsup.filter,
    storeList: editsup.storeList
  };
}

export default connect( mapStateToProps )( SelStoreSup );

