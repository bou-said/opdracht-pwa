import {Row, Col, Button} from 'react-bootstrap';
import React, {useEffect, useState} from "react";



export function NotificationsOnline({data}) {
    const [sendNotifications, setSendNotifications] = useState(false);
    const tempInCelsius = (data?.main) && (data.main.temp - 272.15).toFixed(1);

    useEffect(() => {
        sendNotificationBasedOnTemperature();

    }, [data, sendNotifications]);

    async function sendNotificationBasedOnTemperature() {
        if (!sendNotifications) return;
        const tempMin = 0;
        const tempMax = 20;

        if (tempInCelsius <= tempMin) {

            console.log(`ik stuur iets! Vriesweer!`);
            const serviceWorkerRegistration = await navigator.serviceWorker?.getRegistration();
            if (serviceWorkerRegistration) {
                /**
                 * als je een service worker hebt kan je de notification beter via het service worker object laten aanmaken
                 * omdat de service worker dan ook op events van de notification kan reageren.
                 * dit kan je alleen testen als je een service worker hebt... (dus in prod mode)
                 */
                serviceWorkerRegistration.showNotification(`Huidige temperatuur voor ${data.name} is ${tempInCelsius} graden Celcius. Ik raad je aan om een dikke jas aan te trekken!`);

            } else {
                /** een app zonder service worker kan ook notifications sturen: */
                new Notification(`Huidige temperatuur voor ${data.name} is ${tempInCelsius} graden Celcius. Ik raad je aan om een dikke jas aan te trekken!`);

            }

        }
        if (tempInCelsius >= tempMax) {

            console.log(`ik stuur iets! Terrasjesweer!`);
            const serviceWorkerRegistration = await navigator.serviceWorker?.getRegistration();
            if (serviceWorkerRegistration) {
                /**
                 * als je een service worker hebt kan je de notification beter via het service worker object laten aanmaken
                 * omdat de service worker dan ook op events van de notification kan reageren.
                 * dit kan je alleen testen als je een service worker hebt... (dus in prod mode)
                 */
                serviceWorkerRegistration.showNotification(`Huidige temperatuur voor ${data.name} is ${tempInCelsius} graden Celcius. Ideale terrasjesweer!`);

            } else {
                /** een app zonder service worker kan ook notifications sturen: */
                new Notification(`Huidige temperatuur voor ${data.name} is ${tempInCelsius} graden Celcius. Ideale terrasjesweer!`);

            }

        }

    }

    async function activateNotifications() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log(`user heeft deze permission gegeven voor notifications: ${permission}`);
            if (permission === 'granted') {
                setSendNotifications(true)

            }
        } else {
            console.log("geen Notification mogelijk in deze browser");
        }
    }

    function stopNotifications() {
        console.log("stop Notifications");
        setSendNotifications(false);
    }

    return (
        <div>
            <Row>
                <Col>
                    <Button onClick={activateNotifications} className="mx-3">activate</Button>
                    <Button onClick={stopNotifications}>stop</Button>
                </Col>
            </Row>
        </div>
    )

}