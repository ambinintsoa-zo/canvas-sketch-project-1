const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [800, 800],
  animate: true,
  duration: Infinity,
};

const sketch = () => {
  const shapeCount = 40;
  const shapeMinSides = 3;
  const shapeMaxSides = 9;
  const shapeMinSize = 20;
  const shapeMaxSize = 100;

  const shapes = [];

  // Generate random shapes
  for (let i = 0; i < shapeCount; i++) {
    const x = random.range(shapeMaxSize, settings.dimensions[0] - shapeMaxSize);
    const y = random.range(shapeMaxSize, settings.dimensions[1] - shapeMaxSize);
    const sides = random.range(shapeMinSides, shapeMaxSides + 1);
    const size = random.range(shapeMinSize, shapeMaxSize + 1);
    const directionX = random.pick([-1, 1]);
    const directionY = random.pick([-1, 1]);
    const fillColor = random.pick(risoColors).hex;
    const strokeColor = random.pick(risoColors).hex;
    const isSpinning = false;
    const rotationSpeed = random.range(0.1, 0.5);

    shapes.push({
      x,
      y,
      sides,
      size,
      directionX,
      directionY,
      fillColor,
      strokeColor,
      isSpinning,
      rotation: 0,
      rotationSpeed,
    });
  }

  const drawShape = (context, shape) => {
    const { x, y, sides, size, directionX, directionY, fillColor, strokeColor, isSpinning, rotation, rotationSpeed } = shape;

    // Update x position based on direction
    const speed = 100;
    const deltaX = directionX * speed / settings.dimensions[0];
    shape.x += deltaX;

    // Reverse direction if shape hits the canvas borders on the x-axis
    if (shape.x < size || shape.x > settings.dimensions[0] - size) {
      shape.directionX *= -1;
    }

    // Update y position based on direction
    const deltaY = directionY * speed / settings.dimensions[1];
    shape.y += deltaY;

    // Reverse direction if shape hits the canvas borders on the y-axis
    if (shape.y < size || shape.y > settings.dimensions[1] - size) {
      shape.directionY *= -1;
    }

    // Apply spinning rotation if enabled
    if (isSpinning) {
      shape.rotation += rotationSpeed;
    }

    // Draw shape
    const radius = size / 2;
    const angle = (Math.PI * 2) / sides;

    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.beginPath();
    context.moveTo(radius, 0);

    for (let i = 1; i < sides; i++) {
      const x = radius * Math.cos(angle * i);
      const y = radius * Math.sin(angle * i);
      context.lineTo(x, y);
    }

    context.closePath();

    // Set shape fill style
    context.fillStyle = fillColor;
    context.fill();

    // Set shape stroke style
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.stroke();

    context.restore();
  };

  const handleShapeClick = (event) => {
    const { offsetX, offsetY } = event;

    shapes.forEach((shape) => {
      const { x, y, isSpinning, size } = shape;
      const radius = size / 2;

      // Check if the click is inside the shape
      if (
        offsetX >= x - radius &&
        offsetX <= x + radius &&
        offsetY >= y - radius &&
        offsetY <= y + radius
      ) {
        shape.fillColor = random.pick(risoColors).hex; // Change fill color when clicked
        shape.isSpinning = !isSpinning; // Toggle spinning state
        shape.rotation = 0; // Reset rotation
      }
    });
  };

  return ({ context, width, height }) => {
    // Clear canvas
    context.clearRect(0, 0, width, height);

    // Add event listener to canvas
    context.canvas.addEventListener('click', handleShapeClick);

    // Draw shapes
    shapes.forEach((shape) => {
      drawShape(context, shape);
    });
  };
};

canvasSketch(sketch, settings);
