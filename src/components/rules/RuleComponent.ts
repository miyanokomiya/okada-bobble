import { Bobble } from "../../pawns/bobbles/Bobble";

export class RuleComponent {
  private bobbles: Bobble[] = [];
  private clusters: Set<Set<Bobble>> = new Set();

  setBobbles(bobbles: Bobble[]) {
    this.bobbles = bobbles;
    this.updateBobbleClusters();
  }

  landBobble(bobble: Bobble): { completed: Set<Bobble> | undefined } {
    this.bobbles.push(bobble);
    this.updateBobbleClusters();
    const completed = this.getCompleteBobblesAt(bobble);
    this.updateBobbleClusters();
    return { completed };
  }

  getBobbleClusters(): Set<Set<Bobble>> {
    return this.clusters;
  }

  protected getCompleteBobblesAt(bobble: Bobble): Set<Bobble> | undefined {
    const cluster = this.getBobbleClusterFor(bobble);
    if (!cluster) return;

    const sameColorBobbles = Array.from(cluster).filter((b) => b.color === bobble.color);

    // Check if the bobble lands on one with another label
    const isPaired = sameColorBobbles.some((b) => {
      if (bobble.label === b.label) return false;

      const distanceSq = Phaser.Math.Distance.BetweenPointsSquared(bobble, b);
      return distanceSq <= (bobble.body.radius + b.body.radius) ** 2 + 1;
    });
    if (!isPaired) return;

    const chained = new Set<Bobble>();
    const remained = new Set<Bobble>(sameColorBobbles);
    chained.add(bobble);
    remained.delete(bobble);

    while (remained.size > 0) {
      let changed = false;
      for (const a of chained) {
        for (const b of remained) {
          const thresholdSq = (a.body.radius + b.body.radius) ** 2 + 1;
          const distanceSq = Phaser.Math.Distance.BetweenPointsSquared(a, b);
          if (distanceSq <= thresholdSq) {
            chained.add(b);
            remained.delete(b);
            changed = true;
          }
        }
      }
      if (!changed) break;
    }

    if (chained.size >= 3) {
      return chained;
    }
  }

  private updateBobbleClusters() {
    const bobbles = this.bobbles;
    const visited = new Set<Bobble>();
    const clusters: Set<Set<Bobble>> = new Set();

    const findCluster = (bobble: Bobble, cluster: Set<Bobble>) => {
      if (visited.has(bobble)) return;
      visited.add(bobble);
      cluster.add(bobble);

      bobbles.forEach((other) => {
        const thresholdSq = (bobble.body.radius + other.body.radius) ** 2 + 1;
        const distance = Phaser.Math.Distance.BetweenPointsSquared(bobble, other);
        if (distance <= thresholdSq) {
          findCluster(other, cluster);
        }
      });
    };

    bobbles.forEach((bobble) => {
      if (visited.has(bobble)) return;

      const cluster: Set<Bobble> = new Set();
      findCluster(bobble, cluster);
      clusters.add(cluster);
    });

    this.clusters = clusters;
  }

  private getBobbleClusterFor(bobble: Bobble): Set<Bobble> | undefined {
    for (const cluster of this.clusters) {
      if (cluster.has(bobble)) {
        return cluster;
      }
    }
    return undefined;
  }
}
