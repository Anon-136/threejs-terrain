import * as THREE from 'three'

const MIN_NODE_SIZE = 500

class QuadTree {
  constructor(min, max) {
    const b = new THREE.Box2(min, max)
    this.root = {
      bounds: b,
      children: [],
      center: b.getCenter(new THREE.Vector2()),
      size: b.getSize(new THREE.Vector2()),
    }
  }

  // return all nodes in QuadTree
  GetChildren() {
    const children = []
    this._GetChildren(this.root, children)
    return children
  }

  // recursively put node's children into target array
  _GetChildren(node, target) {
    if (node.children.length == 0) {
      target.push(node)
      return
    }

    for (let c of node.children) {
      this._GetChildren(c, target)
    }
  }
  // Divide root into 4 child nodes
  // and recursively devide each node based on given position
  Insert(pos) {
    this._Insert(this.root, new THREE.Vector2(pos.x, pos.z))
  }

  _Insert(child, pos) {
    const distToChild = this.DistanceToChild(child, pos)

    if (distToChild < child.size.x && child.size.x > MIN_NODE_SIZE) {
      child.children = this.CreateChildren(child)

      for (let c of child.children) {
        this._Insert(c, pos)
      }
    }
  }
  // Distance of center of the child to the given position
  DistanceToChild(child, pos) {
    return child.center.distanceTo(pos)
  }

  CreateChildren(child) {
    const midpoint = child.bounds.getCenter(new THREE.Vector2())

    // Bottom left
    const b1 = new THREE.Box2(child.bounds.min, midpoint)

    // Bottom right
    const b2 = new THREE.Box2(
      new THREE.Vector2(midpoint.x, child.bounds.min.y),
      new THREE.Vector2(child.bounds.max.x, midpoint.y)
    )

    // Top left
    const b3 = new THREE.Box2(
      new THREE.Vector2(child.bounds.min.x, midpoint.y),
      new THREE.Vector2(midpoint.x, child.bounds.max.y)
    )

    // Top right
    const b4 = new THREE.Box2(midpoint, child.bounds.max)

    // Create Quadtree node
    const children = [b1, b2, b3, b4].map((b) => {
      return {
        bounds: b,
        children: [],
        center: b.getCenter(new THREE.Vector2()),
        size: b.getSize(new THREE.Vector2()),
      }
    })

    return children
  }
}

export default QuadTree
