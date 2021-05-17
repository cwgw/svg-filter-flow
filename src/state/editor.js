import { Fragment, useCallback, useEffect } from "react";
import createStore from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { getDefaultAttributes } from "../utils/filters";

const STORAGE_KEY = "svg_filter_builder";

const initialState = {
  key: undefined,
  nodes: [],
  nodesById: {},
  selectedNode: undefined,
  focusedNode: undefined,
  ui: {
    colorMode: "hex",
    colorModes: ["hex", "rgb", "hsl"],
    canvas: { x: 0, y: 0, s: 1 },
  },
};

export const useStore = createStore(
  persist(store, {
    name: STORAGE_KEY,
  })
);

function store(set, get) {
  return {
    ...initialState,
    initialize: () => {
      const key = get().key;
      if (!key) {
        set(() => ({
          key: uuid(),
          nodes: [],
          nodesById: {},
        }));
      }
    },
    createNode: (payload) => {
      if (payload) {
        get().createNodes([payload]);
      }
    },
    createNodes: (payload) => {
      if (Array.isArray(payload) && payload.length > 0) {
        const nodes = payload.map(({ type, attributes }) => ({
          attributes: [...getDefaultAttributes(type), ...(attributes || [])],
          id: uuid(),
          name: type,
          type,
          position: [0, 0],
        }));

        set((prev) => ({
          ...prev,
          nodes: prev.nodes.concat(nodes.map((el) => el.id)),
          nodesById: {
            ...prev.nodesById,
            ...nodes.reduce((acc, el) => ({ ...acc, [el.id]: el }), {}),
          },
        }));
      }
    },
    deleteNode: (payload) => {
      get().deleteNodes([payload]);
    },
    deleteSelectedNode: () => {
      const { selectedNode, deleteNodes } = get();
      if (selectedNode) {
        deleteNodes([selectedNode]);
      }
    },
    deleteNodes: (payload) => {
      set((prev) => {
        if (!Array.isArray(payload) || payload.length < 1) {
          return { ...prev, nodes: [], nodesById: {} };
        }

        const nodesById = {};
        for (const id in prev.nodesById) {
          if (!payload.includes(id)) {
            nodesById[id] = prev.nodesById[id];
          }
        }

        return {
          ...prev,
          nodes: prev.nodes.filter((el) => !payload.includes(el)),
          nodesById,
        };
      });
    },
    updateNode: (payload) => {
      const { id, attributes, ...rest } = payload;
      const nodes = get().nodes;
      if (nodes.includes(id)) {
        set((prev) => ({
          ...prev,
          nodesById: {
            ...prev.nodesById,
            [id]: {
              ...prev.nodesById[id],
              ...rest,
              attributes: attributes
                ? prev.nodesById[id].attributes.map((el) => {
                    const attribute = attributes.find(
                      ({ name }) => name === el.name
                    );
                    return attribute || el;
                  })
                : prev.nodesById[id].attributes,
            },
          },
        }));
      }
    },
    setSelectedNode: (payload) => {
      set((prev) => ({
        ...prev,
        selectedNode: prev.nodes.includes(payload) ? payload : undefined,
      }));
    },
    setColorMode: (colorMode) => {
      const modes = get().ui.colorModes;
      if (modes.includes(colorMode)) {
        set((prev) => ({ ...prev, ui: { ...prev.ui, colorMode } }));
      }
    },
    toggleColorMode: () => {
      const { colorMode, colorModes } = get().ui;
      const index = colorModes.indexOf(colorMode);
      const next = index + 1 >= colorModes.length ? 0 : index + 1;
      set((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          colorMode: colorModes[next],
        },
      }));
      return colorModes[next];
    },
    setCanvasState: (obj) => {
      set((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          canvas: {
            ...prev.ui.canvas,
            ...obj,
          },
        },
      }));
    },
  };
}

export function Provider({ children }) {
  const initialize = useStore(useCallback((state) => state.initialize, []));

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <Fragment>{children}</Fragment>;
}

export function getLocalState() {
  try {
    const state = window.localStorage.getItem(STORAGE_KEY);
    return JSON.parse(state).state;
  } catch (error) {
    return initialState;
  }
}

// Get nodes
//
export function useNode(id) {
  return useStore(useCallback((state) => state.nodesById[id] || {}, [id]));
}

export function useNodes() {
  return useStore(
    useCallback((state) => state.nodes.map((id) => state.nodesById[id]), [])
  );
}

export function useNodeIds() {
  return useStore(useCallback((state) => state.nodes, []));
}

export function useSelectedNode() {
  return useStore(
    useCallback((state) => state.nodesById[state.selectedNode], [])
  );
}

export function useIsSelectedNode(id) {
  return useStore(useCallback((state) => state.selectedNode === id, [id]));
}

export function useSetSelectedNode() {
  return useStore(useCallback((state) => state.setSelectedNode, []));
}

// Node CRUD
//
export function useCreateNode() {
  return useStore(useCallback((state) => state.createNode, []));
}

export function useUpdateNode() {
  return useStore(useCallback((state) => state.updateNode, []));
}

export function useDeleteNode() {
  return useStore(useCallback((state) => state.deleteNode, []));
}

export function useDeleteSelectedNode() {
  return useStore(useCallback((state) => state.deleteSelectedNode, []));
}

// UI
//
export function useColorMode() {
  return useStore(useCallback((state) => state.ui.colorMode, []));
}

export function useColorModes() {
  return useStore(useCallback((state) => state.ui.colorModes, []));
}

export function useSetColorMode() {
  return useStore(useCallback((state) => state.setColorMode, []));
}

export function useToggleColorMode() {
  return useStore(useCallback((state) => state.toggleColorMode, []));
}

export function useCanvasState() {
  return useStore(useCallback((state) => state.ui.canvas, []));
}

export function useSetCanvasState() {
  return useStore(useCallback((state) => state.setCanvasState, []));
}
