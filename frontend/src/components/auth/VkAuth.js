import React, { Component } from 'react';

import Icon24LogoVK from '@vkontakte/icons/dist/24/logo_vk_color';

const styles = {
    btn: {
        backgroundColor: 'rgb(255, 255, 255)',
        display: 'inline-flex',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.54)',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px',
        padding: 0,
        borderRadius: 2,
        border: '1px solid transparent',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif'
    },
    div: {
        background: 'rgb(255, 255, 255)',
        padding: 10,
        borderRadius: 2
    },
    span: {
        padding: '10px 10px 10px 0px',
        fontWeight: 500
    }
}

export default class VkAuth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isProcessing: false,
        }
    }

    componentDidMount() {
        this.sdkLoaded();
        this.asyncInit();
        this.loadSdkAsync();
    }

    asyncInit() {
        const { apiId } = this.props;
        window.vkAsyncInit = () => {
        window.VK.init({ apiId });
        this.setState({ isLoaded: true });
        };
    }

    sdkLoaded() {
        this.setState({ isLoaded: true });
    }

    loadSdkAsync() {
        const el = document.createElement('script');
        el.type = 'text/javascript';
        el.src = 'https://vk.com/js/api/openapi.js?';
        el.async = true;
        el.id = 'vk-sdk';
        document.getElementsByTagName('head')[0].appendChild(el);
    }

    checkLoginState = (response) => {
        this.setState({ isProcessing: false });

        this.props.callback(response);
    };

    handleClick = () => {
        if (!this.state.isLoaded || this.state.isProcessing || this.props.disabled) {
        return;
        }
        this.setState({ isProcessing: true });
        window.VK.Auth.login(this.checkLoginState);
    };

    render() {
        const { disabled, callback, apiId, containerStyle, ...buttonProps } = this.props;
        return (
        <button
            {...buttonProps}
            onClick={this.handleClick}
            style={styles.btn}>
            <div style={styles.div}>    
                <Icon24LogoVK height={18}/>
            </div>
            <span style={styles.span}>
                Login
            </span>
        </button >
        );
    }
}