import React, {useContext} from 'react';

import Navbar from '../components/organisms/navbar'
import Main from '../components/organisms/main'
import Cards from '../components/organisms/cards'
import Info from '../components/organisms/info'

import {SocketContext} from '../hooks/Socket'
import {PlayerCards} from '../hooks/PlayerCards'
import {BlackCard} from "../hooks/BlackCard"
import {Settings} from "../hooks/Settings"

let nickname = "unknown";

export function getCookie(cname: string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const Homepage = () => {
    const socket: any = useContext(SocketContext)

    window.onload = function () {
        socket.emit('new player');
        checkCookie();
    };

    window.onbeforeunload = closingCode;

    function closingCode() {
        let date = new Date();
        let input = {
            date: "[" + String(date.getHours()).padStart(2, "0") + ":"
                + String(date.getMinutes()).padStart(2, "0") + ":"
                + String(date.getSeconds()).padStart(2, "0") + "]",
            author: nickname,
            sauce: "leaves the game"
        }
        socket.emit('message', input);
        socket.emit('leaverTrigger');
        return null;
    }

    function checkCookie() {
        let username = getCookie("username");
        if (username !== "") {
            socket.emit('updateName', username);
            nickname = username;
        } else {
            username = prompt("Please enter your nickname", "") || "unknown";
            socket.emit('updateName', username);
            if (username !== "" && username !== null && username !== undefined) {
                setCookie("username", username, 1);
            }
        }
    }

    function setCookie(cname: string, cvalue: string, exdays: number) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    return (
        <div id="wrapper">
            <Settings>
                <Navbar/>
                <BlackCard>
                    <Main/>
                    <PlayerCards>
                        <Cards/>
                    </PlayerCards>
                </BlackCard>
                <Info/>
            </Settings>
        </div>
    );
}

export default Homepage;
