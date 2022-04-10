import {Row, Col, Button} from 'react-bootstrap';

export function NotificationsOnline({data}) {
    let sendNotifications = false;
    let tempInCelsius = (data?.main) && (data.main.temp - 272.15).toFixed(1);

    async function continuouslySendNotification() {
        let notificationCounter = 0;
        const ms = 5000;
        console.log(`main app stuurt elke ${ms / 1000} seconden een notification`);
        sendNotifications = true;
        while (sendNotifications) {
            await new Promise(resolve => setTimeout(resolve, ms)); // sleep
            ++notificationCounter;
            if (sendNotifications) {
                console.log(`ik stuur iets! ${notificationCounter}`);
                const serviceWorkerRegistration = await navigator.serviceWorker?.getRegistration();
                if (serviceWorkerRegistration) {
                    /**
                     * als je een service worker hebt kan je de notification beter via het service worker object laten aanmaken
                     * omdat de service worker dan ook op events van de notification kan reageren.
                     * dit kan je alleen testen als je een service worker hebt... (dus in prod mode)
                     */
                    serviceWorkerRegistration.showNotification(`Huidige temperatuur voor ${data.name} is ${tempInCelsius} graden Celcius`)
                } else {
                    /** een app zonder service worker kan ook notifications sturen: */
                    new Notification(`Huidige temperatuur voor ${data.name} is ${tempInCelsius} graden Celcius`);
                }
            }
        }
    }

    async function activateNotifications() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log(`user heeft deze permission gegeven voor notifications: ${permission}`);
            if (permission === 'granted') {
                continuouslySendNotification();
            }
        } else {
            console.log("geen Notification mogelijk in deze browser");
        }
    }

    function stopNotifications() {
        console.log("stop Notifications");
        sendNotifications = false;
    }

    return (
        <div>
            <Row>
                <Col>
                    <Button onClick={activateNotifications}>activate</Button>
                </Col>
                <Col>
                    <Button onClick={stopNotifications}>stop</Button>
                </Col>
            </Row>
        </div>
    )

}