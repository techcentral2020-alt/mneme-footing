export interface Title {
  text: string;
}

export interface Context {
  narrative: string;
}

export interface SystemConstraint {
  id: string;
  label: string;
  description: string;
  visualNodeId: string;
}

export interface SystemConstraints {
  items: SystemConstraint[];
}

export interface Intervention {
  summary: string;
  outcomes: string[];
}

export interface ImageVisualNode {
  id: string;
  type: "image";
  label: string;
  src: string;
  alt: string;
}

export interface DiagramVisualNode {
  id: string;
  type: "diagram";
  label: string;
  content: string;
}

export type VisualNode = ImageVisualNode | DiagramVisualNode;

export interface VisualNodes {
  nodes: VisualNode[];
}

export interface ForensicPayload {
  title: Title;
  context: Context;
  systemConstraints: SystemConstraints;
  intervention: Intervention;
  visualNodes: VisualNodes;
}

function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
}

function assertObject(value: unknown, field: string): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
}

function validateTitle(value: unknown): Title {
  assertObject(value, "title");
  assertNonEmptyString(value.text, "title.text");
  return { text: value.text };
}

function validateContext(value: unknown): Context {
  assertObject(value, "context");
  assertNonEmptyString(value.narrative, "context.narrative");
  return { narrative: value.narrative };
}

function validateVisualNode(value: unknown): VisualNode {
  assertObject(value, "visual node");
  assertNonEmptyString(value.id, "visual node id");
  assertNonEmptyString(value.label, "visual node label");
  assertNonEmptyString(value.type, "visual node type");

  if (value.type === "image") {
    if (typeof value.src !== "string") {
      throw new Error("image visual node src must be a string");
    }
    assertNonEmptyString(value.alt, "image visual node alt");
    return {
      id: value.id,
      type: "image",
      label: value.label,
      src: value.src,
      alt: value.alt,
    };
  }

  if (value.type === "diagram") {
    assertNonEmptyString(value.content, "diagram visual node content");
    return {
      id: value.id,
      type: "diagram",
      label: value.label,
      content: value.content,
    };
  }

  throw new Error(`visual node type must be "image" or "diagram"`);
}

function validateVisualNodes(value: unknown): VisualNodes {
  assertObject(value, "visualNodes");
  if (!Array.isArray(value.nodes) || value.nodes.length === 0) {
    throw new Error("visualNodes.nodes must contain at least one visual node");
  }

  const nodes = value.nodes.map((node) => validateVisualNode(node));
  return { nodes };
}

function validateSystemConstraints(
  value: unknown,
  visualNodeIds: Set<string>,
): SystemConstraints {
  assertObject(value, "systemConstraints");
  if (!Array.isArray(value.items) || value.items.length === 0) {
    throw new Error("systemConstraints.items must contain at least one constraint");
  }

  const items = value.items.map((item, index) => {
    assertObject(item, `systemConstraints.items[${index}]`);
    assertNonEmptyString(item.id, `systemConstraints.items[${index}].id`);
    assertNonEmptyString(item.label, `systemConstraints.items[${index}].label`);
    assertNonEmptyString(
      item.description,
      `systemConstraints.items[${index}].description`,
    );
    assertNonEmptyString(
      item.visualNodeId,
      `systemConstraints.items[${index}].visualNodeId`,
    );

    if (!visualNodeIds.has(item.visualNodeId)) {
      throw new Error(
        `systemConstraints.items[${index}] references missing visual node "${item.visualNodeId}"`,
      );
    }

    return {
      id: item.id,
      label: item.label,
      description: item.description,
      visualNodeId: item.visualNodeId,
    };
  });

  return { items };
}

function validateIntervention(value: unknown): Intervention {
  assertObject(value, "intervention");
  assertNonEmptyString(value.summary, "intervention.summary");

  if (!Array.isArray(value.outcomes) || value.outcomes.length === 0) {
    throw new Error("intervention.outcomes must contain at least one outcome");
  }

  const outcomes = value.outcomes.map((outcome, index) => {
    assertNonEmptyString(outcome, `intervention.outcomes[${index}]`);
    return outcome;
  });

  return { summary: value.summary, outcomes };
}

export function validateForensicPayload(value: unknown): ForensicPayload {
  assertObject(value, "forensic payload");

  const title = validateTitle(value.title);
  const context = validateContext(value.context);
  const visualNodes = validateVisualNodes(value.visualNodes);
  const visualNodeIds = new Set(visualNodes.nodes.map((node) => node.id));
  const systemConstraints = validateSystemConstraints(
    value.systemConstraints,
    visualNodeIds,
  );
  const intervention = validateIntervention(value.intervention);

  return {
    title,
    context,
    systemConstraints,
    intervention,
    visualNodes,
  };
}
