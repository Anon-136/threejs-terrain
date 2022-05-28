import * as THREE from 'three'
import { MIN_CHUNK_SIZE } from './Chunk'

export class QuadNode {
  constructor(bounds) {
    this.bounds = bounds
    this.size = bounds.getSize(new THREE.Vector2())
    this.center = bounds.getCenter(new THREE.Vector2())
    this.children = []
  }
}
export class QuadTree {
  constructor({ min, max }) {
    this.root = new QuadNode(new THREE.Box2(min, max))
  }

  // recursively put node's children into target
  getChildren(node = this.root) {
    if (node.children.length === 0) {
      return [node]
    }
    const children = []
    for (const c of node.children) {
      children.push(...this.getChildren(c))
    }
    return children
  }

  // Divide root into 4 child nodes
  // and recursively devide each node based on given position
  insert(pos, node = this.root) {
    const distToNode = this.distanceToNode(pos, node)
    if (distToNode < node.size.x && node.size.x > MIN_CHUNK_SIZE) {
      node.children = this.createChildren(node)
      for (const child of node.children) {
        this.insert(pos, child)
      }
    }
  }

  // Distance of center of the node to the given position
  distanceToNode(pos, node) {
    return node.center.distanceTo(pos)
  }

  createChildren(node) {
    const midpoint = node.center

    // Bottom left
    const b1 = new THREE.Box2(node.bounds.min, midpoint)

    // Bottom right
    const b2 = new THREE.Box2(
      new THREE.Vector2(midpoint.x, node.bounds.min.y),
      new THREE.Vector2(node.bounds.max.x, midpoint.y)
    )

    // Top left
    const b3 = new THREE.Box2(
      new THREE.Vector2(node.bounds.min.x, midpoint.y),
      new THREE.Vector2(midpoint.x, node.bounds.max.y)
    )

    // Top right
    const b4 = new THREE.Box2(midpoint, node.bounds.max)

    // Create Quadtree node
    return [b1, b2, b3, b4].map((b) => new QuadNode(b))
  }
}
