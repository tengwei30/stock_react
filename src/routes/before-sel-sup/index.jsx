import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from '../../core';
import { Icon } from 'antd-mobile';


class BeforeSelSup extends React.Component {
  componentDidMount() {
    window.setDocumentTitle( '选择供应商' );
  }
  goSelSup() {
    this.props.dispatch(
        routerRedux.push( '/sup/sel-supplier' )
      );
  }
  // 根据时间和状态筛选页
  goFilter() {
    this.props.dispatch(
      routerRedux.push( '/sup/filter' )
    );
  }
  render() {
    return ( <div>
      <div style={{ background: '#efeff4', width: '100%', height: '0.88rem', padding: '0 0.16rem' }}>
        <span>
          <Icon type="search" style={{ position: 'absolute', left: '.26rem', top: '.18rem', color: '#ccc', width: '32px' }} />
        </span>
        <input
          placeholder=" &nbsp;&nbsp;&nbsp;请选择供应商"
          style={{
            background: '#fff',
            width: '85%',
            height: '0.66rem',
            lineHeight: '0.88rem',
            float: 'left',
            borderRadius: '.06rem',
            marginTop: '.06rem',
            marginLeft: '.12rem',
            fontSize: '0.24rem',
            color: '#ccc',
            textAlign: 'left',
            display: 'block' }}
          onClick={::this.goSelSup} />

        <span style={{
          display: 'inline-block',
          width: '10%',
          height: '0.78rem',
          textAlign: 'center',
          color: '#10A0E0',
          marginTop: '.28rem',
          marginLeft: '.12rem',
          fontSize: '.24rem' }}
          onClick={::this.goFilter}>筛选</span>
        <div style={{ color: '#666', textAlign: 'center', padding: '.3rem', fontSize: '.3rem' }}>暂无更多数据</div>
      </div>
    </div> );
  }
}


export default connect()( BeforeSelSup );
