import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Text from "../utils/i18n";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Skeleton from "react-loading-skeleton";

const useStyles = makeStyles({
	root: {
		minWidth: 275,
	},
	bullet: {
		display: "inline-block",
		margin: "0 2px",
		transform: "scale(0.8)",
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
	actions: {
		display: "flex",
	},
});

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps() {
	const config = await import(`../data/config.json`);

	return {
		props: {
			siteConfig: config.default,
		},
	};
}

/**
 * 投票项目
 * @param {string} title 标题
 * @param {string} description 描述
 * @param {number} id ID
 */
const MusicItem = ({ title, description, id, statu }) => {
	const classes = useStyles();
	return (
		<Card className={classes.root}>
			<CardContent>
				<Typography
					className={classes.title}
					color="textSecondary"
					gutterBottom
				>
					由
					<Typography variant="inherit" color="primary">
						学生会
					</Typography>
					发起的
				</Typography>
				<Typography variant="h5" component="h2">
					{title}
				</Typography>
				<Typography variant="body2" component="p">
					{description}
				</Typography>
			</CardContent>
			<CardActions>
				<Link href={`/music?id=${id}`}>
					<Button
						disabled={statu != 0}
						variant="outlined"
						size="large"
					>
						{
							{
								0: "投票",
								1: "已结束",
							}[statu]
						}
					</Button>
				</Link>
			</CardActions>
		</Card>
	);
};

// TODO 骨架屏占位
const HomePage = ({ userData }) => {
	const [data, setData] = useState({
		isLoading: true,
	});
	console.log(data);

	// See https://stackoverflow.com/questions/63570597/typeerror-func-apply-is-not-a-function
	useEffect(() => {
		(async () => {
			const res = await fetcher(`/api/music/getMusicList`);
			setData(res.data);
		})();
	}, []);
	
	const classes = useStyles()

	return (
		<>
			<div className={classes.actions}>
				{userData && !!userData.isAdmin && (
					<Link href="/music/create">
						<Button color="primary" variant="contained">
							创建投票
						</Button>
					</Link>
				)}
			</div>

			<Grid container spacing={3}>
				{!!data.length &&
					data.map((item, i) => (
						<Grid xs={12} sm={6} item>
							<MusicItem key={i} {...item} />
						</Grid>
					))}
			</Grid>
			{JSON.stringify(data) === "[]" && (
				<Typography align="center" variant="h5" color="textSecondary">
					暂时没有投票
				</Typography>
			)}
			{!!data.isLoading && (
				<Grid xs={12} sm={6} item>
					{Array(4)
						.fill(0)
						.map(() => (
							<Skeleton />
						))}
				</Grid>
			)}
		</>
	);
};

const Page = ({ siteConfig, locale }) => (
	<Layout
		currentPage={{
			text: "首页",
			path: "/",
		}}
		config={siteConfig}
		locale={locale}
	>
		<HomePage />
	</Layout>
);

export default Page;
