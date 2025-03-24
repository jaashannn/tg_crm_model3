import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To extract dealId from URL
import axios from "axios"; // For making HTTP requests
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Loader from "../Loading/Loader";

const ViewDeals = () => {
  const [deal, setDeal] = useState(null); // State to store the single deal
  const [deals, setDeals] = useState([]); // State to store all deals for drag-and-drop
  const { id } = useParams(); // Extract dealId from URL params
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch the single deal
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/deal/${id}`); // Fetch deal by ID
        setDeal(response.data); // Set the deal in state
      } catch (error) {
        console.error("Error fetching deal:", error);
      }
    };

    fetchDeal();
  }, [id]);

  // Fetch all deals for drag-and-drop (optional, if you want to display all deals)
  useEffect(() => {
    const fetchAllDeals = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/deals`); // Fetch all deals
        setDeals(response.data.deals); // Set all deals in state
      } catch (error) {
        console.error("Error fetching all deals:", error);
      }
    };

    fetchAllDeals();
  }, []);

  // Group deals by stage
  const groupedDeals = deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) {
      acc[deal.stage] = [];
    }
    acc[deal.stage].push(deal);
    return acc;
  }, {});

  // Define stages in order
  const stages = [
    "Demo Scheduled",
    "Demo Done",
    "Opportunity",
    "POC",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
    "Nurture",
  ];

  // Handle drag-and-drop
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside the list, do nothing
    if (!destination) return;

    // If dropped in the same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the deal being dragged
    const deal = deals.find((d) => d.id === draggableId);

    // Update the deal's stage
    const updatedDeals = deals.map((d) =>
      d.id === draggableId ? { ...d, stage: destination.droppableId } : d
    );

    setDeals(updatedDeals);

    // Send update to the backend
    try {
      await axios.patch(`${apiUrl}/api/deal/${draggableId}`, {
        stage: destination.droppableId,
      });
    } catch (error) {
      console.error("Error updating deal stage:", error);
    }
  };

  if (!deal) {
    return <Loader />; // Show loading state while fetching
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen flex flex-col">
      {/* Top Section: Divided into Two Equal Parts */}
      <div className="flex flex-1 gap-6 mb-6">
        {/* Left Part: Deal Details */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Deal Details</h1>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Stage:</span> {deal.stage}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Value:</span> ${deal.value}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current Tools:</span> {deal.currentTools}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Cross-Browser Testing:</span> {deal.crossBrowserTesting}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Automation Percentage:</span> {deal.automationPercentage}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Testing Team:</span> {deal.testingTeam}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Challenges:</span> {deal.challenges}
            </p>
          </div>
        </div>

        {/* Right Part: Additional Deal Details */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">CI/CD Challenges:</span> {deal.ciCdChallenges}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Goals:</span> {deal.goals}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Technical Environment:</span> {deal.technicalEnvironment}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Budget Allocated:</span> {deal.budgetAllocated}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Trial Success Metrics:</span> {deal.trialSuccessMetrics}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Collaboration Process:</span> {deal.collaborationProcess}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Drag-and-Drop Board */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Deal Stages</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">
            {stages.map((stage) => (
              <Droppable droppableId={stage} key={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-700 mb-4">{stage}</h3>
                    {groupedDeals[stage]?.map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 rounded shadow-sm mb-2"
                          >
                            {deal.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ViewDeals;