"use client";
import React from "react";
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";

const contents = [
	{ id: 1, title: "First Post", type: "Blog" },
	{ id: 2, title: "Second Post", type: "Video" }
];

export default function ContentList() {
	const handleEdit = (id: number) => {
		console.log("Edit:", id);
	};

	const handleDelete = (id: number) => {
		console.log("Delete:", id);
	};

	return (
		<List>
			{contents.map(content => (
				<ListItem key={content.id}>
					<ListItemText primary={content.title} secondary={content.type} />
					<ListItemSecondaryAction>
						<Button onClick={() => handleEdit(content.id)} color="primary">
							Edit
						</Button>
						<Button onClick={() => handleDelete(content.id)} color="secondary">
							Delete
						</Button>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
}
