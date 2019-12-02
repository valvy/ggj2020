name := "Formfiller-Backend"
 
version := "1.0" 
      
lazy val `FormFiller-BackEnd` = (project in file(".")).enablePlugins(PlayScala)

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
      
resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"

scalaVersion := "2.12.2"

libraryDependencies ++= Seq( jdbc ,  ehcache , ws , specs2 % Test , guice )
libraryDependencies += "mysql" % "mysql-connector-java" % "8.0.18"
libraryDependencies ++=  Seq("org.sangria-graphql" %% "sangria" % "1.4.2" ,"org.sangria-graphql" %% "sangria-slowlog" % "0.1.8",
"org.sangria-graphql" %% "sangria-circe" % "1.2.1")
unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )

      