import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTimeline } from "@/utils/api/wedding-timeline";

export default function useProfileData({ eventId, token }) {
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(true);
  const [milestonesError, setMilestonesError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadMilestones = useCallback(async () => {
    if (!eventId || !token) {
      if (isMountedRef.current) setMilestonesLoading(false);
      return;
    }
    if (isMountedRef.current) {
      setMilestonesLoading(true);
      setMilestonesError(null);
    }
    const { data, error } = await fetchTimeline(eventId, token);
    if (!isMountedRef.current) return;
    if (error) {
      setMilestonesError(error);
      setMilestones([]);
    } else {
      setMilestones(data?.timeline || []);
    }
    setMilestonesLoading(false);
  }, [eventId, token]);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  return {
    milestones,
    milestonesLoading,
    milestonesError,
    refetchMilestones: loadMilestones,
  };
}
