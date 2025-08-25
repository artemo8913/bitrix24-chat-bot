//https://bitrix-tools.github.io/b24jssdk/guide/example-hook-node-work.html

import express from 'express';
import * as dotenv from "dotenv";
import bodyParser from 'body-parser'
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { LoggerBrowser, B24Hook } from "@bitrix24/b24jssdk";
import { BOT_REQ_BODY } from "./types";

const ONE_MINUTE_MS = 1000 * 60;
const WISHED_TIME = '07:00';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Загрузка переменных окружения из .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

// Получение API URL из переменных окружения и создание B24Hook
const $b24 = B24Hook.fromWebhookUrl('https://b24-g6xa1e.bitrix24.ru/rest/1/hwvghjqer2jmqfua/');

$b24.setLogger(LoggerBrowser.build("Core", false));


class GoodMorningBot {
  private _dialogs: Set<string> = new Set();
  private $b24: B24Hook

  constructor($b24: B24Hook) {
    this.$b24 = $b24;
  }

  private addMessage(dialogId: string, msg: string) {
    this.$b24.callMethod('imbot.message.add', {
      MESSAGE: msg,
      DIALOG_ID: dialogId,
      CLIENT_ID: process.env.VITE_B24_HOOK_USER_ID,
    }).then()
      .catch((e) => console.error((`Ошибка при отправке сообщения dialog_id ${dialogId}`)))
  }

  private wishGoodMorning(dialogId: string) {
    this.addMessage(dialogId, 'Доброго утра!');
  }

  private wishGoodMinute(dialogId: string) {
    this.addMessage(dialogId, 'Хорошей минутки!');

  }

  private async getBitrixTime(): Promise<Date | null> {
    try {
      const response = await $b24.callMethod(
        "server.time",
        {}
      );

      const result = new Date(response.getData().result);
      return result;
    } catch (e) {
      console.log('Не получено время сервера');
      return null;
    }
  }

  async isTimeToWishGoodMorning(): Promise<boolean> {
    const now = await this.getBitrixTime() || new Date();

    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Asia/Krasnoyarsk',
      hour: 'numeric',
      minute: 'numeric',
    });

    const time = formatter.format(now)

    if (time === WISHED_TIME) {
      return true;
    }
    return false;
  }

  noticeAboutSubsribing(dialogId: string) {
    this.addMessage(dialogId, 'Вы подписаны на добрые пожелания');
  }

  addDialog(DIALOG_ID: string) {
    this._dialogs.add(DIALOG_ID);
  }

  wishGoodMorningForAllSubsribers() {
    Array.from(this._dialogs).forEach(dialog => this.wishGoodMorning(dialog));
  }

  wishGoodMinuteForAllSubscribers() {
    Array.from(this._dialogs).forEach(dialog => this.wishGoodMinute(dialog));
  }

  getDialogs() {
    return this._dialogs;
  }
}


const goodBot = new GoodMorningBot($b24);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });

  return;
});

app.post('/', (req, res) => {
  const body: BOT_REQ_BODY = req.body;

  if (!body) {
    throw new Error('Нет тела сообщения от битрикс');
  }

  if (body.event === 'ONIMBOTMESSAGEADD' || body.event === 'ONAPPINSTALL') {
    goodBot.noticeAboutSubsribing(body.data.PARAMS.DIALOG_ID);
    goodBot.addDialog(body.data.PARAMS.DIALOG_ID);
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

setInterval(async () => {
  goodBot.wishGoodMinuteForAllSubscribers();

  if (await goodBot.isTimeToWishGoodMorning()) {
    goodBot.wishGoodMorningForAllSubsribers();
  }
}, ONE_MINUTE_MS / 2);
