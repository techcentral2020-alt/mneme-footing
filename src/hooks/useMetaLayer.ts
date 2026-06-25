"use client";

import { useCallback, useSyncExternalStore } from "react";

type MetaLayerListener = () => void;

let isTransparent = false;
const listeners = new Set<MetaLayerListener>();

function subscribe(listener: MetaLayerListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return isTransparent;
}

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setTransparentState(next: boolean): void {
  if (isTransparent === next) {
    return;
  }

  isTransparent = next;
  emitChange();
}

export function resetMetaLayerForTests(): void {
  setTransparentState(false);
}

export function useMetaLayer() {
  const transparent = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toggleTransparent = useCallback(() => {
    setTransparentState(!isTransparent);
  }, []);

  const setTransparent = useCallback((next: boolean) => {
    setTransparentState(next);
  }, []);

  return {
    isTransparent: transparent,
    toggleTransparent,
    setTransparent,
  };
}
