Text file: App.jsx
Latest content with line numbers:
66	      <Router>
67	        <Routes>
68	          <Route path="/" element={<HomePage />} />
69	          <Route 
70	            path="/login" 
71	            element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
72	          />
73	          <Route 
74	            path="/register" 
75	            element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} 
76	          />
77	          <Route 
78	            path="/dashboard" 
79	            element={user && !isAdmin ? <DashboardPage /> : <Navigate to="/login" />} 
80	          />
81	          <Route 
82	            path="/module/:moduleId" 
83	            element={user && !isAdmin ? <ModulePage /> : <Navigate to="/login" />} 
84	          />
85	          <Route 
86	            path="/quiz/:quizId" 
87	            element={user && !isAdmin ? <QuizPage /> : <Navigate to="/login" />} 
88	          />
89	          <Route 
90	            path="/certificate" 
91	            element={user && !isAdmin ? <CertificatePage /> : <Navigate to="/login" />} 
92	          />
93	          <Route 
94	            path="/admin/login" 
95	            element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLoginPage onLogin={handleLogin} />} 
96	          />
97	          <Route 
98	            path="/admin/dashboard" 
99	            element={isAdmin ? <AdminDashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />} 
100	          />
101	          <Route path="*" element={<Navigate to="/" />} />
102	        </Routes>
103	      </Router>
104	    </UserContext.Provider>
105	  )