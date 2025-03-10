"use client";

import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Checkbox } from "@/app/components/Checkbox";
import styles from "./gamePage.module.css";
import { useRef } from "react";

const GamePage = ({ params }: { params: { id: string } }) => {
  const containerRef = useRef(null);

  return (
    <section className={`${styles.playersList}`} ref={containerRef}>
      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Player_1</CardHeader>
        <CardBody>
          <div className={styles.playerTickBox}>
            <Checkbox />
          </div>
        </CardBody>
      </Card>
    </section>
  );
};

export default GamePage;
