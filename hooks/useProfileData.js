import { useCallback, useEffect, useRef, useState } from "react";
import { fetchEvents, fetchTimeline } from "@/utils/api/wedding-timeline";

function pickPrimaryEvent(events) {
  if (!Array.isArray(events) || events.length === 0) return null;
  const sorted = [...events].sort((a, b) => {
    const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bd - ad;
  });
  return sorted[0];
}

export default function useProfileData({ token }) {
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [milestonesError, setMilestonesError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadMilestones = useCallback(
    async (eventId) => {
      if (!eventId || !token) return;
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
    },
    [token]
  );

  useEffect(() => {
    const loadAll = async () => {
      if (!token) {
        // Idle until a real token arrives. Initial eventLoading=true holds.
        return;
      }
      if (isMountedRef.current) {
        setEventLoading(true);
        setEventError(null);
      }
      const { data: eventList, error } = await fetchEvents(token);
      if (!isMountedRef.current) return;
      if (error) {
        setEventError(error);
        setEvent(null);
        setEvents([]);
        setEventLoading(false);
        return;
      }
      setEvents(eventList || []);
      const primary = pickPrimaryEvent(eventList);
      setEvent(primary);
      setEventLoading(false);
      if (primary?._id) {
        loadMilestones(primary._id);
      } else {
        setMilestones([]);
      }
    };
    loadAll();
  }, [token, loadMilestones]);

  const refetchMilestones = useCallback(() => {
    if (event?._id) return loadMilestones(event._id);
    return Promise.resolve();
  }, [event, loadMilestones]);

  return {
    event,
    events,
    eventLoading,
    eventError,
    milestones,
    milestonesLoading,
    milestonesError,
    refetchMilestones,
  };
}
