"use client";

import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Checkbox } from "@/app/components/Checkbox";
import styles from "./gamePage.module.css";
import { useRef } from "react";

const GamePage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <section className={`${styles.playersList}`}>
        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>10</div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.playerCard}>
          <CardHeader>Player_1</CardHeader>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>
              <Checkbox className={styles.checkboxAlt}/>
            </div>
          </CardBody>
        </Card>
      </section>
      <section className={styles.gameBoard}>
        <div className={styles.boardActions}>
          <button>Reveal</button>
          <button>Reset</button>
          <button>Delete</button>
          <button>Invite</button>
        </div>
        <div className={styles.gameData}>
          <div className={styles.gameStatus}>In Progress</div>
          <h3>Average: 0</h3>
        </div>
      </section>
      <section className={styles.sizeList}>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1000</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>10</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
      </section>
    </>
  );
};

export default GamePage;
